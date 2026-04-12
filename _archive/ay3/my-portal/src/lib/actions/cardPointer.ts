// Svelte action: per-card pointer tracker for sheen + 3D tilt + shadow blob.
// Sets --ptr-x / --ptr-y on the node, normalized 0..1 within the card.
// Skips if pointer is touch-primary or reduced-motion.
// Lifted from routes/young-carpets/+page.svelte on 2026-04-08 (v1.24.x refactor).
export function cardPointer(node: HTMLElement) {
	const isTouchPrimary =
		typeof window !== 'undefined' &&
		window.matchMedia('(hover: none), (pointer: coarse)').matches;
	const prm =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (isTouchPrimary || prm) return {};

	let raf = 0;
	const onMove = (e: PointerEvent) => {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			const r = node.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width;
			const y = (e.clientY - r.top) / r.height;
			node.style.setProperty('--ptr-x', String(x));
			node.style.setProperty('--ptr-y', String(y));
			raf = 0;
		});
	};
	const onLeave = () => {
		node.style.setProperty('--ptr-x', '0.5');
		node.style.setProperty('--ptr-y', '0.5');
	};
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);
	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
			if (raf) cancelAnimationFrame(raf);
		}
	};
}
