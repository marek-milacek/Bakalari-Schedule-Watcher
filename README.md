# Bakalari Schedule Watcher

A simple watcher that checks your Bakalari timetable for changes and sends a notification when lessons are cancelled.

## Requirements

- Node.js 20+ (used in the workflow)
- `npm`
- Bakalari account with API access
- ntfy.sh channel for notifications

## Installation

1. Run `npm install`
2. Create a `.env` file in the project folder.
3. Copy the values from `.env.example` and replace them with your own credentials.

## Configuration

Set these environment variables in `.env`:

- `BAKALARI_URL` - Bakalari base URL without `/login`
- `BAKALARI_USERNAME` - your Bakalari username
- `BAKALARI_PASSWORD` - your Bakalari password
- `NTFY_CHANNEL` - ntfy.sh channel name

### Example `.env`

```env
BAKALARI_URL=https://example.bakalari.cz
BAKALARI_USERNAME=your_username
BAKALARI_PASSWORD=your_password
NTFY_CHANNEL=your_ntfy_channel
```

## Usage

Run the watcher manually:

```bash
node app.js
```

If the app finds cancelled lessons for today, it will send a notification to your ntfy channel.

## Mobile notifications

If you use the ntfy mobile app, enter only the channel name in the app settings.

Example channel name:

```text
bakalari_example_channel
```

## How it works

- Finds a working Bakalari API endpoint
- Authenticates using `grant_type=password`
- Downloads the current timetable
- Checks today’s schedule for changes
- Sends a notification if lessons are cancelled

## Security

- Do not commit `.env` to Git.
- `.env` should only be stored locally.
- If your `.env` file already contains secrets, remove it from the repository and rotate the credentials.
- GitHub Actions should use repository secrets instead of plain text values.

## GitHub Actions

This project already includes a workflow that runs `node app.js` on a schedule. Use GitHub Secrets for:

- `BAKALARI_URL`
- `BAKALARI_USERNAME`
- `BAKALARI_PASSWORD`
- `NTFY_CHANNEL`

## Notes

- `.env` is ignored by `.gitignore`.
- Keep your credentials private and do not share them in the repo.
