require("dotenv").config();
const axios = require("axios");

let baseUrl = process.env.BAKALARI_URL.replace(/\/login\/?$/, "").replace(
    /\/$/,
    "",
);
const ntfyChannel = process.env.NTFY_CHANNEL;
const username = process.env.BAKALARI_USERNAME;
const password = process.env.BAKALARI_PASSWORD;

// List of potential API endpoints to check
const apiEndpoints = [
    "/api/login",
    "/api/3/login",
    "/bakalari/api/3",
    "/next/api/3",
];

// Sends a notification via ntfy.sh with a warning tag
async function sendNotification(message) {
    try {
        await axios.post(`https://ntfy.sh/${ntfyChannel}`, message, {
            headers: {
                Title: "Warning",
                Priority: "5",
                Tags: "warning",
            },
        });
        console.log("Notification sent successfully.");
    } catch (error) {
        console.error("Failed to send notification:", error.message);
    }
}

// Tries to find the correct login endpoint on the server
async function discoverLoginUrl() {
    console.log(`Discovering API endpoints on ${baseUrl}...`);
    for (const endpoint of apiEndpoints) {
        const fullUrl = `${baseUrl}${endpoint}`;
        try {
            await axios.post(fullUrl);
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.log(`Match found: ${endpoint}`);
                return fullUrl;
            }
        }
    }
    return null;
}

// Main function to check schedule changes
async function runWatcher() {
    try {
        const loginUrl = await discoverLoginUrl();
        if (!loginUrl) {
            throw new Error("Could not find a valid Bakalari API endpoint.");
        }

        console.log("Authenticating...");
        const loginResponse = await axios.post(
            loginUrl,
            new URLSearchParams({
                client_id: "ANDR",
                grant_type: "password",
                username: username,
                password: password,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        const token = loginResponse.data.access_token;
        console.log("Downloading schedule...");

        const timetableResponse = await axios.get(
            `${baseUrl}/api/3/timetable/actual`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        const timetable = timetableResponse.data;
        const todayStr = new Date().toISOString().split("T")[0];
        const currentDay = timetable.Days.find((day) =>
            day.Date.startsWith(todayStr),
        );

        if (!currentDay) {
            console.log("No schedule for today.");
            return;
        }

        let cancelledLessons = [];
        for (const atom of currentDay.Atoms) {
            if (
                atom.Change &&
                (atom.Change.ChangeType === "Canceled" ||
                    atom.Change.ChangeType === "Removed")
            ) {
                cancelledLessons.push(
                    `- ${atom.Change.Hours} (${atom.Change.Time}): ${atom.Change.Description}`,
                );
            }
        }

        if (cancelledLessons.length > 0) {
            const report = `The following lessons have been cancelled:\n\n${cancelledLessons.join("\n")}`;
            console.log(report);
            await sendNotification(report);
        } else {
            console.log("No schedule changes detected.");
        }
    } catch (error) {
        console.error(
            "Execution error:",
            error.response ? error.response.data : error.message,
        );
    }
}

runWatcher();
