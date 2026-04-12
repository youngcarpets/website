// Svelte action: animated number counter on scroll-into-view.
// Reads data-target (number) and data-suffix from the node.
// Honors prefers-reduced-motion (instantly final value).
// Lifted from routes/young-carpets/+page.svelte on 2026-04-08 (v1.24.x refactor).
export function countUp(node: HTMLElement) {
	const target = parseInt(node.dataset.target ?? '0', 10);
	const suffix = node.dataset.suffix ?? '';
	const duration = 1800;
	const fmt = (n: number) =>
		new Intl.NumberFormat('en-CA').format(Math.floor(n)) + suffix;

	if (
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		node.textContent = fmt(target);
		return {};
	}

	let started = false;
	const animate = () => {
		const t0 = performance.now();
		const tick = (now: number) => {
			const elapsed = now - t0;
			const p = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - p, 3);
			node.textContent = fmt(target * eased);
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	};

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting && !started) {
					started = true;
					animate();
					io.disconnect();
				}
			});
		},
		{ threshold: 0.5 }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
