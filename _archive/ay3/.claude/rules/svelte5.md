# Svelte 5 Rules

- Always use runes: `$props()`, `$state()`, `$derived()`, `$effect()`, `{@render}`
- Never use legacy patterns: `export let`, `<slot/>`, `createEventDispatcher`
- Component props via `let { prop1, prop2 } = $props<Type>()`
- Children via `{@render children()}` not `<slot/>`
