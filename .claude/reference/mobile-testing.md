# Mobile Testing — LAN Access from iPhone

> Confirmed working 2026-04-06. iPhone Safari → PC dev server over same WiFi.

## Quick Start

### Option A: Simple (just the server)
1. Run `.\scripts\start-portal.bat` from `c:\DEV\ay3\` in PowerShell
2. Check terminal for the **Network** URL (e.g. `http://10.0.0.214:5175`)
3. Open that URL in Safari on iPhone (same WiFi)

### Option B: Full Mobile Dev Mode (auto-pull + server)
1. Run `.\scripts\mobile.bat` from `c:\DEV\ay3\` in PowerShell
2. This auto-pulls latest git changes every 5s + starts the dev server with `--host`
3. Finds and checks out the latest `claude/*` branch if one exists
4. Check terminal for the **Network** URL
5. Open that URL in Safari on iPhone

## Bat Files

| File | Purpose |
|------|---------|
| `scripts/start-portal.bat` | Simple: `cd my-portal && npm run dev -- --host` |
| `scripts/mobile.bat` | Full: git fetch → checkout latest branch → npm install → kill stale servers → start dev server + auto-pull |
| `scripts/auto-pull.bat` | Background helper: `git pull` every 5s with retry/backoff (launched by `mobile.bat`) |

## How It Works
- `--host` flag exposes the Vite dev server to the local network (not just localhost)
- iPhone and PC must be on the **same WiFi network** (Rogers — `phub.net.cable.rogers.com`)
- PC Wi-Fi IPv4: `10.0.0.214` (may change if router reassigns)
- Port: usually 5173, but Vite increments if busy (5174, 5175, etc.) — always check terminal output

## Firewall Setup (one-time, already done 2026-04-06)
Open **PowerShell as Admin** (right-click Start menu → Terminal/PowerShell Admin):
```
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173-5180 -Protocol TCP -Action Allow
```
This opens ports 5173–5180 so Vite can serve to LAN regardless of which port it picks.

## Troubleshooting
- **Spinning wheel on phone?** → Windows Firewall blocking the port. Re-run the firewall command above as Admin.
- **Port changed?** → Vite increments if 5173 is busy. Always check terminal output for the actual port.
- **IP changed?** → Run `ipconfig` in PowerShell, look for **Wi-Fi → IPv4 Address**.
- **Still not working?** → Confirm phone is on the same WiFi network as the PC.
- **Stale server blocking port?** → `mobile.bat` auto-kills processes on port 5173. For manual cleanup: `netstat -ano | findstr :5173` then `taskkill /pid <PID> /f`.
- **Git pull failing?** → `auto-pull.bat` has retry with backoff (3 failures → 30s cooldown). Check network connection.
