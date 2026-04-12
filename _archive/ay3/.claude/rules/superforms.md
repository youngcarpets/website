# Superforms + Zod Rules

- Always use Zod v4 adapter: `import { zod4 as zod } from 'sveltekit-superforms/adapters'`
- Never use `zod` or `zodClient` — these are v3 adapters and will fail silently
- Server-side: `const form = await superValidate(zod(schema))`
- Client-side: `const { form, errors, enhance } = superForm(data.form)`
