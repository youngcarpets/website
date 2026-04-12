# Phone Dev Preview — Cloudflare Quick Tunnel

How to view the live Vite dev server on a phone from anywhere
(any Wi-Fi or cellular), with hot-reload, no admin/UAC required.

Locked-in 2026-04-07 after a long debugging session. Migrated from
per-device memory to repo on 2026-04-08 so all devices/sessions can
follow the same workflow.

## Why not LAN IP (`http://10.0.0.x:5173`)?

- Windows Firewall blocks inbound on dev ports by default (needs UAC to fix — user dislikes surprise UAC popups)
- DHCP rotates both phone and laptop IPs — IP changes break the URL constantly
- Only works on same Wi-Fi — useless on cellular or away from home

## One-time setup

1. **cloudflared standalone binary** lives at `C:/Users/alany/.claude/bin/cloudflared.exe` (~63 MB, downloaded from `https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe`). No install, no admin.

2. **`my-portal/vite.config.ts`** has `server.allowedHosts` permitting tunnel domains:
   ```ts
   server: {
     allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app']
   }
   ```
   Without this, Vite returns "Blocked request. This host is not allowed." Committed in v1.20.7 on 2026-04-07.

## Per-session workflow

1. Start Vite with `--host` (binds to all interfaces, required for tunnel to reach it):
   ```bash
   cd my-portal && npm run dev -- --host
   ```

2. Start the quick tunnel pointing at port 5173 (run in background):
   ```bash
   "c:/Users/alany/.claude/bin/cloudflared.exe" tunnel --url http://localhost:5173 --no-autoupdate
   ```

3. Read the tunnel output for the random `https://*.trycloudflare.com` URL (printed in the first ~5 seconds). Hand that URL to the user — append the route they want, e.g. `/young-carpets`.

## Caveats

- Quick-tunnel URLs are **ephemeral** — they die when cloudflared stops or the laptop sleeps. New URL every restart. For a permanent URL, set up a named tunnel under a Cloudflare account (not done yet).
- Hot reload works over the tunnel (Vite HMR via WebSocket through Cloudflare).
- First load on phone: if user previously hit a Vite "Blocked request" error, the phone may cache it. Have them retry in private/incognito mode.
- The phone needs no special config — just paste the URL.

## Why not localtunnel/ngrok?

- localtunnel (`npx localtunnel`) shows a warning interstitial page and is less reliable
- ngrok requires an account + auth token for stable use
- Cloudflare quick tunnels: zero account, zero config, just works

## Trigger phrases

When the user says "phone preview", "show on phone", "preview on phone", or similar, follow this workflow. Ask which port if not the default 5173.
