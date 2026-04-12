// LEGACY — used only by `routes/dev/+page.server.ts` (the internal DB playground tool).
// Production code should use `locals.supabase` (set by hooks.server.ts) instead.
// This file will be removed when the dev page is refactored to use the proper server client pattern.
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
