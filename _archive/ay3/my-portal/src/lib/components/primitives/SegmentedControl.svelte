<!--
	SegmentedControl<T> — generic pill-row segmented control.
	Used wherever you have a small set of mutually exclusive options that
	should render as horizontal pills (LVT tabs, rubber segments, slip ratings, etc).

	Theme-agnostic structure. Consumer passes class names for the wrapper + pill
	+ active state so each instance can adopt a different visual style.
-->
<script lang="ts" generics="T extends string">
	type Option = { id: T; label: string };
	type Props = {
		options: Option[];
		value: T;
		onChange: (id: T) => void;
		role?: 'tablist' | 'radiogroup';
		ariaLabel: string;
		/** Class on the wrapper div */
		class?: string;
		/** Class on each pill button */
		pillClass?: string;
		/** Class added when pill is active */
		activeClass?: string;
	};

	let {
		options,
		value,
		onChange,
		role = 'tablist',
		ariaLabel,
		class: cls = '',
		pillClass = '',
		activeClass = 'is-active'
	}: Props = $props();
</script>

<div class={cls} {role} aria-label={ariaLabel}>
	{#each options as o}
		<button
			type="button"
			class={pillClass}
			class:is-active={value === o.id}
			role={role === 'radiogroup' ? 'radio' : 'tab'}
			aria-checked={role === 'radiogroup' ? value === o.id : undefined}
			aria-selected={role === 'tablist' ? value === o.id : undefined}
			onclick={() => onChange(o.id)}
		>
			{o.label}
		</button>
	{/each}
</div>
