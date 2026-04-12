# Troubleshoot Agent — Index

> Ported from ay3 (2026-04-12). `my-portal/` paths reference archive examples at `_archive/ay3/`.
> **Owned playbooks**: connection, tunnels, firewall, env vars, ports, DNS, database connectivity
> **Resource file**: `.claude/resources/30-troubleshooting-playbooks.md`
> **Update protocol**: any time this agent solves a new infra/connection issue, append the playbook to the resource file (via Resource Merger if growing) and add a one-line entry below.

---

## Solved Playbooks (chronological)

| # | Date | Symptom | Root Cause | Resource Section |
|---|------|---------|------------|------------------|
| 1 | 2026-04-07 | Dev server not loading on phone via LAN IP | Windows Firewall blocking inbound on Vite ports + DHCP IP rotation | `30-troubleshooting-playbooks.md` § Phone-LAN-Access |
| 2 | 2026-04-07 | "Blocked request. This host is not allowed" via tunnel | Vite `server.allowedHosts` missing tunnel domain | `30-troubleshooting-playbooks.md` § Vite-AllowedHosts |
| 3 | 2026-04-07 | Cached "Blocked request" error persists on phone after fix | Mobile browser cached the 4xx error | `30-troubleshooting-playbooks.md` § Mobile-Cache-Bust |
| 4 | 2026-04-07 | Multiple Vite instances on 5173/5174/5175 | Stale `node` processes from prior sessions | `30-troubleshooting-playbooks.md` § Stale-Vite-Cleanup |

---

## Standard Diagnostic Toolbox (Windows)

| Need | Command |
|------|---------|
| What's listening on dev ports | `netstat -ano \| grep -E ":(517[0-9])"` |
| LAN IP (ignore 172.x WSL/Hyper-V virtual) | `ipconfig \| grep "IPv4"` |
| Test reachability of own LAN IP | `powershell -Command "Test-NetConnection -ComputerName <ip> -Port <port> -InformationLevel Quiet"` |
| Kill all node processes | `powershell -Command "Get-Process node \| Stop-Process -Force"` |
| List node processes with start times | `powershell -Command "Get-Process node \| Select Id, StartTime"` |
| Check active connections to a port | `netstat -ano \| grep ":<port>" \| grep ESTABLISHED` |

## Standard Diagnostic Toolbox (cross-platform / app-level)

| Need | Approach |
|------|----------|
| Is Vite bound to all interfaces? | Look for `0.0.0.0:<port>` in netstat, OR start with `npm run dev -- --host` |
| Is a tunnel reachable end-to-end? | Hit it from the laptop browser first; if that fails, the tunnel is broken, not the phone |
| Mobile browser caching error pages | Have user retry in private/incognito; switch browsers; toggle airplane mode |
| Supabase env vars loaded? | Check `my-portal/.env` for `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`; restart Vite (env changes need restart) |

---

## Hard Rules (LOVE'd by user)

| # | Rule | Source |
|---|------|--------|
| 1 | **Never trigger UAC or focus-stealing popups without warning the user first and waiting for go-ahead.** | `feedback_no_surprise_popups.md` (user memory, 2026-04-07) |
| 2 | **Never blame the code/website when the dev server is fine.** Always state that the page is working and the issue is *between* phone and laptop. User gets demoralized when it sounds like their work is broken. | 2026-04-07 session |
| 3 | **Diagnose layered**: localhost → LAN → public. Pinpoint which layer fails. Don't propose fixes without that. | 2026-04-07 session |
