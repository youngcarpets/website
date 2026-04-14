/**
 * Svelte action: adds/removes `.illuminated` class when the element
 * enters the vertical center band of the viewport.
 *
 * Uses IntersectionObserver with negative rootMargin so only the
 * middle ~30% of the screen triggers the callback — off-main-thread,
 * no per-frame JS.
 */
export function illuminateOnScroll(node: HTMLElement) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				node.classList.toggle('illuminated', entry.isIntersecting);
			}
		},
		{
			rootMargin: '-28% 0px -35% 0px',
			threshold: 0
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}
