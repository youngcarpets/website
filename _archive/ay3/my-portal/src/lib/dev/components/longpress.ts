// Svelte action: long-press without firing tap.
//
// Usage:
//   <button use:longpress={{ on: () => showLabel() }}>...</button>
//
// On a 500ms hold the `on` callback fires and the element gets a
// `data-longpress="true"` attribute (CSS can hook into it to reveal a tooltip).
// On release / cancel before the threshold the element returns to normal
// and the click event is allowed through.

interface LongPressOptions {
	on: () => void;
	threshold?: number;
}

export function longpress(node: HTMLElement, opts: LongPressOptions) {
	let options = opts;
	let timer: number | undefined;
	let fired = false;

	function start(e: PointerEvent) {
		fired = false;
		try {
			node.setPointerCapture(e.pointerId);
		} catch {
			/* noop */
		}
		timer = window.setTimeout(() => {
			fired = true;
			node.dataset.longpress = 'true';
			options.on();
		}, options.threshold ?? 500);
	}

	function end(e: PointerEvent) {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
		try {
			node.releasePointerCapture(e.pointerId);
		} catch {
			/* noop */
		}
		// Clear long-press flag on next frame so the tooltip can fade
		requestAnimationFrame(() => {
			node.dataset.longpress = 'false';
		});
		// If we fired the long-press, swallow the upcoming click
		if (fired) {
			node.addEventListener('click', swallow, { once: true, capture: true });
		}
	}

	function swallow(e: Event) {
		e.preventDefault();
		e.stopImmediatePropagation();
	}

	node.addEventListener('pointerdown', start);
	node.addEventListener('pointerup', end);
	node.addEventListener('pointercancel', end);
	node.addEventListener('pointerleave', end);

	return {
		update(next: LongPressOptions) {
			options = next;
		},
		destroy() {
			if (timer !== undefined) clearTimeout(timer);
			node.removeEventListener('pointerdown', start);
			node.removeEventListener('pointerup', end);
			node.removeEventListener('pointercancel', end);
			node.removeEventListener('pointerleave', end);
		}
	};
}
