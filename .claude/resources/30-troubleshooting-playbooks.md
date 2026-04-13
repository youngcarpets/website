# 30 — Troubleshooting Playbooks

> **Append-only.** Each playbook is a self-contained recipe: symptom, diagnosis, fix, and prevention. Owned by the Troubleshoot agent. Never replace — only add new sections.

---

## Phone-LAN-Access

**Symptom:** Vite dev server loads on laptop but phone can't reach `http://10.0.0.x:5173`.

**Diagnosis ladder (run in order):**

1. **Is Vite bound to all interfaces?**
   ```bash
   netstat -ano | grep ":5173"
   ```
   Look for `0.0.0.0:5173` (good — LAN-reachable) vs `[::1]:5173` or `127.0.0.1:5173` (bad — loopback only). If loopback only, restart with `npm run dev -- --host`.

2. **Can the laptop hit its own LAN IP?**
   ```powershell
   Test-NetConnection -ComputerName 10.0.0.214 -Port 5173 -InformationLevel Quiet
   ```
   - `True` → Vite is fine, the problem is *between* phone and laptop (firewall, DNS, router).
   - `False` → Vite isn't actually bound to the LAN interface. Restart with `--host`.

3. **Is the phone on the same subnet?** Both should be `10.0.0.x` (or whatever the home LAN uses). If phone is on a guest SSID, cellular, or different subnet, the LAN IP route is impossible — use a tunnel instead.

4. **Windows Firewall (most common cause when 1+2 pass):**
   - All three profiles (Domain/Private/Public) block inbound by default
   - Fix requires admin (UAC) — **WARN USER FIRST, WAIT FOR APPROVAL**
   - Command (run as admin):
     ```powershell
     New-NetFirewallRule -DisplayName "Vite Dev 5173-5180" -Direction Inbound -Protocol TCP -LocalPort 5173-5180 -Action Allow -Profile Private,Domain
     ```

**Prevention:** Use a Cloudflare tunnel instead — see `Phone-Preview-Cloudflare-Tunnel` below. Bypasses firewall, DHCP rotation, and works from any network.

---

## Phone-Preview-Cloudflare-Tunnel

**Symptom:** Need to view dev server on phone from anywhere (Wi-Fi, cellular, away from home) without firewall changes.

**Setup (one-time):**

1. Download cloudflared standalone binary (no install, no admin):
   ```bash
   mkdir -p "c:/Users/alany/.claude/bin"
   curl -L -o "c:/Users/alany/.claude/bin/cloudflared.exe" \
     "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
   ```

2. Add tunnel domains to `vite.config.ts`:
   ```ts
   server: {
     allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app']
   }
   ```
   Restart Vite. (Committed in v1.20.7.)

**Run (every session):**

1. Start Vite with `--host`:
   ```bash
   cd my-portal && npm run dev -- --host
   ```

2. Start the tunnel (background):
   ```bash
   "c:/Users/alany/.claude/bin/cloudflared.exe" tunnel --url http://localhost:5173 --no-autoupdate
   ```

3. Read the random `https://*.trycloudflare.com` URL from cloudflared output (printed in first ~5 seconds). Append the route the user wants and hand it over.

**Caveats:**
- Quick-tunnel URLs are **ephemeral** — die when cloudflared stops or laptop sleeps. New URL every restart.
- HMR works over the tunnel.
- Phone needs no config; just paste the URL.
- For a permanent URL, set up a named tunnel under a Cloudflare account (not done yet).

**Why not alternatives:**
- `npx localtunnel`: shows a warning interstitial, less reliable
- ngrok: requires account + auth token for stable use
- Cloudflare quick tunnel: zero config, just works

---

## Vite-AllowedHosts

**Symptom:** Tunnel URL returns: `Blocked request. This host ("xxx.trycloudflare.com") is not allowed. To allow this host, add "xxx.trycloudflare.com" to server.allowedHosts in vite.config.js.`

**Cause:** Vite (since 5.x) blocks unknown hosts by default to prevent DNS rebinding attacks. Tunnel domains are unknown.

**Fix:** In `my-portal/vite.config.ts`:
```ts
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app']
  }
});
```

The leading dot is a wildcard for all subdomains. Restart Vite — config changes are NOT picked up by HMR.

**Do NOT use** `allowedHosts: true` (allows everything — DNS rebinding risk). Use a wildcard list of trusted tunnel providers only.

---

## Mobile-Cache-Bust

**Symptom:** Phone shows an old error page (Vite "Blocked request", 502, white screen) even after the underlying issue is fixed.

**Cause:** Mobile browsers (especially Safari) aggressively cache 4xx/5xx responses and tunnel landing pages.

**Fix ladder:**
1. Open the URL in **private/incognito** mode → bypasses cache and most content blockers.
2. Try a **different browser** on the phone (Safari ↔ Chrome).
3. Toggle **Wi-Fi off → cellular on**, retry. If this works, your home Wi-Fi has DNS filtering blocking the tunnel domain.
4. Toggle **Wi-Fi on → cellular off**, retry. Confirms #3 if it fails.
5. Last resort: clear the browser's site data for that exact host.

---

## Stale-Vite-Cleanup

**Symptom:** `netstat` shows multiple Vite instances on consecutive ports (5173, 5174, 5175) — Vite picks the next free port when the previous is held by a stale process.

**Cause:** Prior `npm run dev` sessions weren't properly killed (laptop sleep, terminal closed without Ctrl-C, hot-reload crash).

**Fix:**
```powershell
Get-Process node | Select Id, StartTime    # see what's running
Get-Process node | Stop-Process -Force      # nuke all node
```

Then restart cleanly:
```bash
cd my-portal && npm run dev -- --host
```

**Prevention:** Always Ctrl-C Vite before closing the terminal. If using `scripts/start-portal.bat`, ensure it has a clean shutdown path.

**Caution:** `Stop-Process node` kills *all* node processes, including unrelated ones (other projects, MCP servers, etc.). If those exist, target by PID instead.

---

## ModalTabs-Snippet-Rename

**Symptom:** Build error after renaming ModalTabs snippet props (e.g. `product` → `overview`, `maintain` → `care`).

**Cause:** ModalTabs.svelte defines snippet props (`overview`, `install`, `care`) that must match the `{#snippet name()}` blocks in every consumer. If you rename a tab, you must update: (1) ModalTabs.svelte type + props + render block, (2) CarpetTileModal.svelte snippets, (3) ExpandedProduct.svelte generic fallback snippets.

**Fix:** Search for old snippet name across all three files. The tab type, props interface, destructuring, and `{@render}` calls all need updating.

**Files involved:**
- `src/lib/components/ModalTabs.svelte` — type, props, render
- `src/lib/components/CarpetTileModal.svelte` — snippet blocks
- `src/lib/components/ExpandedProduct.svelte` — generic fallback snippets

---

## SupplierMarquee-Filter-Prop

**Symptom:** SupplierMarquee shows all 18 suppliers instead of filtered list in product modal.

**Cause:** Missing `material` prop. The component defaults to showing all suppliers when no material is passed.

**Fix:** Pass `material="carpet-tile"` (or whichever product) and `compact` to the component:
```svelte
<SupplierMarquee material="carpet-tile" compact />
```

**Data dependency:** `src/lib/content/suppliers.ts` must have `materials[]` array on each supplier. The `suppliersByMaterial()` function filters by it.

---

## Database-Connection-Refused (template — fill in when first encountered)

> Will be populated the first time we hit a Supabase connection issue. Anchor symptoms to look for:
> - `fetch failed` from Supabase client
> - "Invalid API key" → wrong `PUBLIC_SUPABASE_ANON_KEY`
> - "Failed to fetch" → wrong `PUBLIC_SUPABASE_URL` or network/DNS issue
> - RLS-denying-everything → policy missing or wrong
> - Env vars not loaded → `.env` in wrong directory or Vite needs restart
