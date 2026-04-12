# Git Save Rules — PERMANENT

## The One Rule

Everything goes to main. Always. That's the default. No questions, no jargon.

Think of it like one folder on a desktop. The user works on it from different devices. When they say "save," it saves to that folder. Done.

## Feature Branches

Feature branches ONLY exist when the user explicitly asks for one (e.g., "let's do a feature branch," "keep this separate," "don't push to main today").

When on a feature branch:
- All commits stay on the feature branch — do NOT touch main
- If the user says "save," ask in plain English:
  **"You're on a feature branch right now. Do you want to put this on main, or just save it to the feature branch?"**
- Do NOT assume. Do NOT auto-merge to main. Wait for their answer.
- If they say "just save it" → commit and push the feature branch only
- If they say "put it on main" → merge to main and push

## No Jargon

Never say: origin, remote, upstream, rebase, HEAD, merge conflict, diverged, fast-forward, tracking branch, fetch, pull request (unless they ask for a PR).

Instead say: save, main copy, feature copy, put it on main, GitHub copy.

The user doesn't need to hear how Git works. Just do the right thing quietly.

## Summary

| Situation | What happens |
|---|---|
| Normal session, user says "save" | Goes to main. No questions. |
| Feature branch, user says "save" | Ask first — main or just the feature? |
| No feature branch specified | Everything goes to main. Period. |
