# SCM Tool

Professional release of SCM Tool — a browser helper for soccerclubmanager.com.

SCM Tool provides in-page automation and analytics helpers for football manager-style web games. It is distributed as a small JavaScript utility that you can run on the game's pages to surface a floating control panel with modules for market scanning, signing suggestions, sales appraisal, XP/training loops, squad analytics and academy scouting.

IMPORTANT: Only use this tool on soccerclubmanager.com or other sites where executing custom scripts is permitted by the site's Terms of Service. Using automation on platforms that forbid it may lead to account suspension.

Repository: https://github.com/demoncor99YT/scm-tool

Table of contents
- Features
- Quick start (bookmarklet)
- Manual installation (console)
- Configuration & behavior
- Safety & privacy
- Development & contribution
- License

Features
- Market scanner & auto-signing by Talent, Age, Level, Budget and Position
- Appraise and recommend sale prices
- XP/training automation loop
- Squad analysis (averages)
- Academy scanner to highlight youth prospects
- Building profitability audit (Upgrades)
- In-page UI with logs and controls

Quick start — bookmarklet (recommended)
1. Create a new bookmark in your browser.
2. For the bookmark URL use the following one-line bookmarklet (copy as-is):

```
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githubusercontent.com/demoncor99YT/scm-tool/main/src/scm-bot.js';s.onload=function(){console.log('SCM Tool loaded');};document.body.appendChild(s);})();void(0);
```

3. Open https://soccerclubmanager.com and click the bookmarklet. The floating SCM BOT UI will appear.

Manual installation (developer console)
1. Open the game's page at https://soccerclubmanager.com.
2. Open developer tools (F12) → Console.
3. Paste the contents of `src/scm-bot.js` and press Enter.

Configuration & behavior
- The UI exposes several tabs: Market, XP, Upgrades, Team, Academy, Tips.
- Market: configure minimum talent, maximum age, minimum level, position and max budget. Use FILTER & BUY to scan current listings and trigger a buy action when a match is found.
- XP: triggers training clicks across available buttons. Optionally enable auto-loop.
- Upgrades: scans building upgrade pages and recommends best ROI investments.
- Academy: scans youth players and highlights gems and acceptable prospects.

How the script interacts with the page
- The tool scans table rows (`tr`), cells (`td`), and typical `button` elements. It expects the game's DOM to present player/building information in a text format the script can parse (numbers, € signs, position text). If the game's UI changes, the tool may stop working and will need updates.

Safety & privacy
- The script runs entirely in your browser and does not send data to external servers.
- For safety, disable automatic loops before navigating away from the page.
- Do not use automation on accounts you cannot risk losing; follow soccerclubmanager.com's rules.

Development & contribution
- The main script lives in `src/scm-bot.js`.
- If you want bug fixes, improvements, or translations, open an issue or submit a pull request.
- Suggested improvements: localization, robust DOM selectors, unit tests, a packaged browser extension.

License
This project is provided under the MIT License (see LICENSE).

Credits
- Original script and UI by PikaBot (adapted and published by demoncor99YT).

