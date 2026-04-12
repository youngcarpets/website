# Zed Editor Reference — Windows

Zed v0.231.1 on Win 10 — shortcuts, gotchas, fixes. The user's IDE on the
current dev box. Migrated from per-device memory to repo on 2026-04-08 so
the same reference is available from any device that opens this project.

Sources: zed.dev/docs/{,windows.html} · issues: github.com/zed-industries/zed/issues

## Keys

- Command palette: `Ctrl+Shift+P`
- File picker: `Ctrl+P`
- Symbol picker: `Ctrl+Shift+O`
- Project find: `Ctrl+Shift+F`
- Terminal: `Ctrl+\``
- Settings (JSON): `Ctrl+,`
- Extensions: `Ctrl+Shift+X`
- Theme picker: `Ctrl+K Ctrl+T`
- Agent panel: `Ctrl+Shift+A`
- Inline AI: `Ctrl+Enter`

## CLI

- `zed <path>` — open
- `zed --version`
- `zed .` — open cwd

## Win 10 failure modes → fix

| Symptom | Fix |
|---|---|
| Blank window on launch | Update GPU driver; enable HW accel |
| Won't open at all | Verify DX11 via `dxdiag` (System Info → DirectX Version) |
| Weird behavior | Launch with no extensions+settings to bisect |
| Terminal activation scripts skip | Shell profile exiting early — check `.bashrc`/`.zshrc` |
| Git ops fail in zed | Git Bash / PowerShell not on PATH |
| SSH askpass never appears | Credential manager blocking GUI prompt |
| Sluggish in VM | Emulated GPU adapter — known degradation |
| Ghost text after closing/resizing terminal | KNOWN BUG (`zed-industries/zed#47316`, `#40018`) — bash: `clear` or `Ctrl+L`; cmd/PS: `cls`; or resize pane to force redraw |

## Config

- Settings: `Ctrl+,` (JSON)
- Modal editing: set `vim_mode` or `helix_mode` in settings
- Lang toolchains: Languages section in settings
- Format-on-save: per-language in settings

## Quirks

- Welcome page: only shows in empty **center** pane (split panes hide it)
- Uninstall via Settings → Apps leaves user profile (settings + extensions) intact
- The command palette is Zed's discovery surface — when stuck, `Ctrl+Shift+P` and search

## When this ref is insufficient

Docs are thin on Win specifics → go to GitHub issues, search by symptom.
