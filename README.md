Snapchat Data Visualizer
========================

An elegant local web app to visualize your Snapchat data export:

- Browse chats in a sidebar and switch conversations
- View saved messages and media indicators
- Filter (saved-only, hide empty text, hide unknown)
- In-chat search with highlight
- Charts: messages per day and by sender
- Dark/Light theme toggle

Planned: Browser extension to visualize directly without exporting first.


Quick start
-----------

1) Requirements: Node.js 18+ (LTS recommended)

2) Install and run

```bash
./start-dev.bat
```

The script checks Node.js, installs deps, and starts the dev server on `http://localhost:5173/`.

3) Load your Snapchat export

- Click “Select your Snapchat export root folder” and choose the top-level folder that contains `html/` and `chat_media/`.
- Chats will populate in the sidebar; select one to view messages and charts.


How to download your Snapchat data
----------------------------------

Follow Snapchat’s official guide: [Download My Data from Snapchat](https://help.snapchat.com/hc/en-us/articles/7012305371156-How-do-I-download-my-data-from-Snapchat).

Steps overview:

1) Open the link above and log into Snapchat if prompted
2) Request your data (choose JSON/HTML export)
3) When you receive the email, download and unzip your export
4) In this app, select the unzipped folder (containing `html/` etc.)


Screenshots
-----------

Place your screenshot(s) in `docs/` and reference them here. Example:

![UI Screenshot](docs/screenshot-placeholder.jpg)


Development
-----------

Frontend lives under `app/` (Vite + React + TypeScript).

```bash
cd app
npm install
npm run dev
```


Notes
-----

- Do not commit your personal Snapchat export. `.gitignore` already excludes `html/`, `chat_media/`, `memories/`, etc.
- This project is for local visualization only and does not upload your data anywhere.


