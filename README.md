# SCM Tool

SCM Tool is a small browser-based helper for a football manager-like game. It scans market listings, automates simple signings, assists with selling/appraising players, runs XP/train loops and audits academy/building profitability. The tool is distributed as a single JavaScript file that you can run in the browser console while on the game's pages.

IMPORTANT: Use this script only where allowed by the game's terms of service. Automating interactions can violate some services' rules.

## Features

- Market scanner and auto-signing by Talent/Age/Level/Budget/Position
- Appraise and recommend sale prices
- XP/training automation loop
- Squad analysis (averages)
- Academy scanner to highlight youth prospects
- Building profitability audit (Upgrades)
- In-page UI with logs and controls

## Usage

1. Open the web page of the game in your browser.
2. Open the browser developer console (F12 or right-click → Inspect → Console).
3. Paste the contents of `src/scm-bot.js` and press Enter.
4. The floating SCM BOT UI will appear. Use the tabs and buttons to run the modules.

Notes:
- The script interacts with DOM elements it expects on the page (tables, rows, buttons). It may not work if the game's UI differs significantly.
- There are two automatic loops: Market (5s) and XP (8s). Disable them before leaving the page if needed.

## Files

- `src/scm-bot.js` — main script (IIFE) with UI and automation logic.

## License

This repository is provided without warranty. You may use the code under the MIT License. See `LICENSE` for details.

## Contributing

If you want improvements or fixes, open an issue in this repository.
