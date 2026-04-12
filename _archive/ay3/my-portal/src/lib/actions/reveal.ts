// Svelte action: adds .is-visible class when element scrolls into view.
// Honors prefers-reduced-motion (instantly visible). Disconnects after first reveal.
// Lifted from routes/young-carpets/+page.svelte on 2026-04-08 (v1.24.x refactor).
export function reveal(node: HTMLElement) {
	if (typeof window === 'undefined') return {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return {};
	}
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					node.classList.add('is-visible');
					io.disconnect();
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
