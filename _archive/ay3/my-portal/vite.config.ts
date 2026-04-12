import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app'],
		fs: {
			// Allow imports from package.json (used by the dev version badge
			// in routes/young-carpets/+page.svelte). Default Vite serving
			// allow list does not include the project root above /src/.
			allow: ['..']
		}
	}
});
