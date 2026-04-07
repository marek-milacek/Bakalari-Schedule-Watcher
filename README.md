# Bakalari Schedule Watcher

This app checks Bakalari schedule changes and sends a notification when lessons are cancelled.

## Requirements

- Node.js 20+ (as used in the workflow)
- `npm`
- Bakalari account with API access
- ntfy.sh channel for notifications

## Installation

1. `npm install`
2. Create a `.env` file in the project folder.
3. Copy the values from `.env.example` and fill in your own values.

## Configuration

Required environment variables:

- `BAKALARI_URL` - Bakalari base URL without `/login`
- `BAKALARI_USERNAME` - username
- `BAKALARI_PASSWORD` - password
- `NTFY_CHANNEL` - ntfy.sh channel name

### Example `.env`

```env
BAKALARI_URL=https://example.bakalari.cz
BAKALARI_USERNAME=your_username
BAKALARI_PASSWORD=your_password
NTFY_CHANNEL=your_ntfy_channel
```

## Run

```bash
node app.js
```

## What the app does

- Finds a working Bakalari API endpoint
- Logs in using `grant_type=password`
- Downloads the current timetable
- Checks today's schedule
- Sends an ntfy notification if cancelled lessons are found

## Security notes

- Do not commit `.env` to the Git repository.
- If `.env` already contains secrets, remove it from the repo and rotate the credentials.
- The GitHub Actions workflow uses secrets instead of hard-coded values.

## Recommendations

- Add `.env` to `.gitignore`.
- If you use GitHub Actions, set `BAKALARI_URL`, `BAKALARI_USERNAME`, `BAKALARI_PASSWORD`, and `NTFY_CHANNEL` as repository secrets.
