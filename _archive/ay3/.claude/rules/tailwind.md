# Tailwind CSS v4 Rules

- Plugin order in vite.config.ts: `tailwindcss()` MUST come BEFORE `sveltekit()`
- Import in app.css: `@import 'tailwindcss'`
- Use `@theme` block for custom properties (not `@layer theme`)
- Glass variables go in `@theme` block in app.css
