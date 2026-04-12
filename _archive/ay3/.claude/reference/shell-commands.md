# Shell Commands — Bash ↔ PowerShell ↔ CMD

Quick lookup for Claude. User runs Git Bash on Win 10 primarily.
**Default to bash syntax** unless told otherwise.

## Equivalents

| task | bash (Git Bash) | PowerShell | cmd |
|---|---|---|---|
| clear screen | `clear` / `C-l` | `cls` / `Clear-Host` | `cls` |
| list files | `ls -la` | `Get-ChildItem` / `gci` / `ls` | `dir` |
| current dir | `pwd` | `Get-Location` / `pwd` | `cd` |
| change dir | `cd path` | `cd path` / `Set-Location` | `cd /d path` |
| make dir | `mkdir -p a/b/c` | `mkdir a/b/c` / `New-Item -ItemType Directory` | `mkdir a\b\c` |
| remove file | `rm file` | `Remove-Item file` / `rm` | `del file` |
| remove dir recursive | `rm -rf dir` | `Remove-Item -Recurse -Force dir` | `rmdir /s /q dir` |
| copy file | `cp src dst` | `Copy-Item src dst` / `cp` | `copy src dst` |
| copy dir recursive | `cp -r src dst` | `Copy-Item -Recurse src dst` | `xcopy /e /i src dst` |
| move/rename | `mv a b` | `Move-Item a b` / `mv` | `move a b` |
| cat file | `cat file` | `Get-Content file` / `cat` / `gc` | `type file` |
| head | `head -n 10 f` | `Get-Content f -Head 10` / `gc f -TotalCount 10` | `more` (no head) |
| tail | `tail -n 10 f` | `Get-Content f -Tail 10` | — |
| tail -f | `tail -f f` | `Get-Content f -Wait -Tail 10` | — |
| find file | `find . -name "*.ts"` | `Get-ChildItem -Recurse -Filter *.ts` / `gci -r -filter *.ts` | `dir /s *.ts` |
| grep | `grep -r "pat" .` | `Select-String -Pattern "pat" -Path *` / `sls` | `findstr /s "pat" *` |
| pipe | `cmd1 \| cmd2` | `cmd1 \| cmd2` (objects) | `cmd1 \| cmd2` |
| redirect stdout | `> file` | `> file` / `Out-File` | `> file` |
| append stdout | `>> file` | `>> file` | `>> file` |
| redirect stderr | `2> file` | `2> file` | `2> file` |
| both | `&> file` or `> f 2>&1` | `*> file` | `> f 2>&1` |
| discard output | `> /dev/null` | `> $null` / `Out-Null` | `> nul` |
| env var (set) | `export X=v` | `$env:X = "v"` | `set X=v` |
| env var (read) | `$X` / `${X}` | `$env:X` | `%X%` |
| home | `~` / `$HOME` | `~` / `$HOME` | `%USERPROFILE%` |
| chain (and) | `a && b` | `a; if ($?) { b }` (PS7: `a && b`) | `a && b` |
| chain (always) | `a ; b` | `a; b` | `a & b` |
| background | `cmd &` | `Start-Job { cmd }` | `start cmd` |
| which | `which cmd` / `type cmd` | `Get-Command cmd` / `gcm` | `where cmd` |
| kill process | `kill -9 PID` | `Stop-Process -Id PID -Force` | `taskkill /F /PID PID` |
| ps aux | `ps aux` / `tasklist` | `Get-Process` / `ps` | `tasklist` |
| date | `date` | `Get-Date` | `date /t` |
| sleep | `sleep 5` | `Start-Sleep 5` | `timeout 5` |
| count lines | `wc -l f` | `(gc f).Count` | `find /c /v "" f` |
| chmod | `chmod +x f` | n/a (NTFS ACLs via `icacls`) | n/a |
| symlink | `ln -s tgt link` | `New-Item -ItemType SymbolicLink -Path link -Target tgt` | `mklink link tgt` |
| curl | `curl URL` | `Invoke-WebRequest URL` / `iwr` / `curl` (alias) | `curl` (Win10+) |
| download file | `curl -O URL` | `iwr URL -OutFile file` | `curl -O URL` |

## Key Differences

**PowerShell `curl` is an alias for `Invoke-WebRequest`** — flags differ from real curl. Use `curl.exe` to force the real binary on Win10+.

**PowerShell pipes objects, not text** — `ls | grep foo` doesn't work; use `gci | where Name -match foo`.

**Bash globbing** done by shell; **PowerShell globbing** done by cmdlet (`-Filter`, `-Include`).

**Path separators**: bash accepts `/`; cmd needs `\`; PowerShell accepts both. In Git Bash on Win, use `/` always.

**Quotes**: bash single quotes = literal; PowerShell single quotes = literal but no escapes; double quotes interpolate `$var` in both.

**Exit codes**: bash `$?`; PS `$LASTEXITCODE` (for native exes) or `$?` (for cmdlets, boolean).

## Git Bash on Windows specifics

- `/c/Users/alany/...` = `C:\Users\alany\...`
- `/dev/null` works (it's MSYS)
- `C-l` clears Zed terminal ghost text bug
- Native Win exes work: `code.exe`, `zed.exe`, `gh.exe`, `git.exe`
- POSIX tools provided: `grep`, `sed`, `awk`, `find`, `curl`, `ssh`, `tar`, `gzip`

## Useful one-liners (bash)

```bash
# size of dir
du -sh dir/

# find + grep combo
grep -rn "TODO" --include="*.ts" .

# kill process on port (Win)
netstat -ano | grep :5173    # find PID
taskkill //F //PID <pid>     # kill it (// not / in Git Bash)

# json pretty
cat f.json | python -m json.tool

# count files
ls | wc -l

# disk free
df -h
```

## PowerShell-only gems (if user is in PS)

```powershell
# kill port
Get-NetTCPConnection -LocalPort 5173 | Select -Exp OwningProcess | Stop-Process -Force

# json pretty
Get-Content f.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# select columns
gci | Select Name, Length, LastWriteTime
```
