// Cinematic 600ms ease-in-out scroll-to-anchor handler.
// Not a Svelte action — call from an `on:click` handler with the target hash.
// Honors prefers-reduced-motion (instant scroll).
// Lifted from routes/young-carpets/+page.svelte on 2026-04-08 (v1.24.x refactor).
export function scrollToHash(e: MouseEvent, hash: string) {
	if (typeof window === 'undefined') return;
	const el = document.querySelector(hash);
	if (!el) return;
	e.preventDefault();
	const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prm) {
		el.scrollIntoView();
		history.replaceState(null, '', hash);
		return;
	}
	const startY = window.scrollY;
	const targetY = (el as HTMLElement).getBoundingClientRect().top + startY - 40;
	const dist = targetY - startY;
	const duration = 600;
	const t0 = performance.now();
	const ease = (t: number) =>
		t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	const tick = (now: number) => {
		const elapsed = now - t0;
		const p = Math.min(elapsed / duration, 1);
		window.scrollTo(0, startY + dist * ease(p));
		if (p < 1) requestAnimationFrame(tick);
		else history.replaceState(null, '', hash);
	};
	requestAnimationFrame(tick);
}
