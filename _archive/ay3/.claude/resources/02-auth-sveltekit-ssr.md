# Authentication — Supabase SSR + SvelteKit (@supabase/ssr)

> **Priority: CRITICAL** — Server-validated sessions required for employee portal.
> Source: https://supabase.com/docs/guides/auth/server-side/sveltekit

---

## Core Rules

### 1. Use `getUser()` — Never `getSession()` for Auth Checks
`getSession()` returns unvalidated JWT data (can be tampered with). `getUser()` makes a network call to validate the token with Supabase.
```typescript
// WRONG — unvalidated, can be spoofed
const { data: { session } } = await supabase.auth.getSession()
if (!session) redirect(303, '/login')

// CORRECT — server-validated
const { data: { user }, error } = await supabase.auth.getUser()
if (!user) redirect(303, '/login')
```

### 2. Dual-Client Pattern (Server vs Browser)
```typescript
// src/lib/server/supabase.ts — server-side (uses cookies)
import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient(cookies: Cookies) {
  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, { ...options, path: '/' })
        )
      }
    }
  })
}

// src/lib/supabaseClient.ts — browser-side
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
```

### 3. Session Validation in `hooks.server.ts`
```typescript
// src/hooks.server.ts
import { createSupabaseServerClient } from '$lib/server/supabase'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient(event.cookies)

  // Attach validated user getter — use this everywhere, not getSession()
  event.locals.getUser = async () => {
    const { data: { user } } = await event.locals.supabase.auth.getUser()
    return user
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    }
  })
}
```

### 4. Protect Routes in `+page.server.ts` Load Functions
```typescript
// src/routes/(portal)/+page.server.ts
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
  const user = await event.locals.getUser()
  if (!user) throw redirect(303, '/login')

  // Now safe to query — RLS will enforce row-level permissions
  const { data: employees } = await event.locals.supabase
    .from('employees')
    .select('*')

  return { employees, user }
}
```

### 5. Route Groups for Auth Separation
```
src/routes/
├── (public)/          ← No auth required (marketing, login, about)
│   └── +layout.svelte
├── (portal)/          ← Auth required (employee dashboard)
│   ├── +layout.server.ts  ← Check auth ONCE for entire group
│   └── +page.svelte
└── auth/
    ├── login/
    └── callback/      ← OAuth redirect handler
```

### 6. Auth Callback Route for OAuth/Magic Links
```typescript
// src/routes/auth/callback/+server.ts
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
  const code = event.url.searchParams.get('code')
  if (code) {
    await event.locals.supabase.auth.exchangeCodeForSession(code)
  }
  throw redirect(303, '/dashboard')
}
```

---

## PKCE Flow Notes
- `@supabase/ssr` uses PKCE by default — do not switch to implicit flow
- Cookies are automatically chunked for large tokens
- Token refresh is handled automatically via the SSR client

---

## Sources
- https://supabase.com/docs/guides/auth/server-side/sveltekit
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/server-side/advanced-guide
