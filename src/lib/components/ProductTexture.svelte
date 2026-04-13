<script lang="ts">
	import type { Product } from '$lib/content/products';

	interface Props {
		material: Product['material'];
	}

	let { material }: Props = $props();
</script>

{#if material === 'carpet'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" stroke-width="1.4" fill="none">
			<path d="M 38 150 L 38 82 Q 38 80 40 80 Q 42 80 42 82 L 42 150 Z" />
			<path d="M 50 150 L 50 74 Q 50 72 52 72 Q 54 72 54 74 L 54 150 Z" />
			<path d="M 62 150 L 62 87 Q 62 85 64 85 Q 66 85 66 87 L 66 150 Z" />
			<path d="M 74 150 L 74 70 Q 74 68 76 68 Q 78 68 78 70 L 78 150 Z" />
			<path d="M 86 150 L 86 80 Q 86 78 88 78 Q 90 78 90 80 L 90 150 Z" />
			<path d="M 98 150 L 98 76 Q 98 74 100 74 Q 102 74 102 76 L 102 150 Z" />
			<path d="M 110 150 L 110 84 Q 110 82 112 82 Q 114 82 114 84 L 114 150 Z" />
			<path d="M 122 150 L 122 72 Q 122 70 124 70 Q 126 70 126 72 L 126 150 Z" />
			<path d="M 134 150 L 134 82 Q 134 80 136 80 Q 138 80 138 82 L 138 150 Z" />
			<path d="M 146 150 L 146 88 Q 146 86 148 86 Q 150 86 150 88 L 150 150 Z" />
			<path d="M 158 150 L 158 76 Q 158 74 160 74 Q 162 74 162 76 L 162 150 Z" />
		</g>
	</svg>
{:else if material === 'carpet-tile'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" stroke-width="1.5" fill="none">
			<rect x="30" y="40" width="38" height="38" rx="3" />
			<rect x="72" y="40" width="38" height="38" rx="3" />
			<rect x="114" y="40" width="38" height="38" rx="3" />
			<rect x="50" y="82" width="38" height="38" rx="3" />
			<rect x="92" y="82" width="38" height="38" rx="3" />
			<rect x="134" y="82" width="38" height="38" rx="3" />
			<rect x="30" y="124" width="38" height="38" rx="3" />
			<rect x="72" y="124" width="38" height="38" rx="3" />
			<rect x="114" y="124" width="38" height="38" rx="3" />
		</g>
	</svg>
{:else if material === 'lvt'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<rect x="15" y="35" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="22" y1="42" x2="86" y2="42" stroke-width="0.7" opacity="0.55" />
			<line x1="22" y1="47" x2="86" y2="47" stroke-width="0.7" opacity="0.4" />
			<line x1="22" y1="52" x2="86" y2="52" stroke-width="0.7" opacity="0.55" />
			<rect x="107" y="35" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="114" y1="42" x2="178" y2="42" stroke-width="0.7" opacity="0.55" />
			<line x1="114" y1="47" x2="178" y2="47" stroke-width="0.7" opacity="0.4" />
			<line x1="114" y1="52" x2="178" y2="52" stroke-width="0.7" opacity="0.55" />
			<rect x="61" y="65" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="68" y1="72" x2="132" y2="72" stroke-width="0.7" opacity="0.55" />
			<line x1="68" y1="77" x2="132" y2="77" stroke-width="0.7" opacity="0.4" />
			<line x1="68" y1="82" x2="132" y2="82" stroke-width="0.7" opacity="0.55" />
			<rect x="15" y="95" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="22" y1="102" x2="86" y2="102" stroke-width="0.7" opacity="0.55" />
			<line x1="22" y1="107" x2="86" y2="107" stroke-width="0.7" opacity="0.4" />
			<line x1="22" y1="112" x2="86" y2="112" stroke-width="0.7" opacity="0.55" />
			<rect x="107" y="95" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="114" y1="102" x2="178" y2="102" stroke-width="0.7" opacity="0.55" />
			<line x1="114" y1="107" x2="178" y2="107" stroke-width="0.7" opacity="0.4" />
			<line x1="114" y1="112" x2="178" y2="112" stroke-width="0.7" opacity="0.55" />
			<rect x="61" y="125" width="78" height="24" rx="2" stroke-width="1.8" />
			<line x1="68" y1="132" x2="132" y2="132" stroke-width="0.7" opacity="0.55" />
			<line x1="68" y1="137" x2="132" y2="137" stroke-width="0.7" opacity="0.4" />
			<line x1="68" y1="142" x2="132" y2="142" stroke-width="0.7" opacity="0.55" />
		</g>
	</svg>
{:else if material === 'hardwood'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<rect x="15" y="35" width="100" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 22 42 Q 60 38 108 44" stroke-width="0.8" opacity="0.6" />
			<path d="M 22 48 Q 55 50 108 47" stroke-width="0.8" opacity="0.45" />
			<path d="M 22 53 Q 50 51 108 53" stroke-width="0.8" opacity="0.55" />
			<ellipse cx="55" cy="46" rx="2.5" ry="1.4" stroke-width="0.7" opacity="0.6" />
			<rect x="123" y="35" width="62" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 130 42 Q 150 39 178 43" stroke-width="0.8" opacity="0.55" />
			<path d="M 130 48 Q 155 50 178 47" stroke-width="0.8" opacity="0.45" />
			<path d="M 130 53 Q 152 51 178 52" stroke-width="0.8" opacity="0.55" />
			<rect x="15" y="65" width="58" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 22 72 Q 42 70 66 73" stroke-width="0.8" opacity="0.55" />
			<path d="M 22 77 Q 40 79 66 76" stroke-width="0.8" opacity="0.45" />
			<path d="M 22 82 Q 45 81 66 83" stroke-width="0.8" opacity="0.55" />
			<ellipse cx="42" cy="76" rx="2" ry="1.3" stroke-width="0.7" opacity="0.6" />
			<rect x="81" y="65" width="104" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 88 72 Q 130 68 178 74" stroke-width="0.8" opacity="0.6" />
			<path d="M 88 77 Q 125 80 178 76" stroke-width="0.8" opacity="0.45" />
			<path d="M 88 82 Q 135 81 178 83" stroke-width="0.8" opacity="0.55" />
			<rect x="15" y="95" width="80" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 22 102 Q 50 99 88 103" stroke-width="0.8" opacity="0.55" />
			<path d="M 22 107 Q 55 110 88 106" stroke-width="0.8" opacity="0.45" />
			<path d="M 22 112 Q 50 111 88 113" stroke-width="0.8" opacity="0.55" />
			<rect x="103" y="95" width="82" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 110 102 Q 145 98 178 104" stroke-width="0.8" opacity="0.6" />
			<path d="M 110 107 Q 140 110 178 106" stroke-width="0.8" opacity="0.45" />
			<path d="M 110 112 Q 148 111 178 113" stroke-width="0.8" opacity="0.55" />
			<ellipse cx="135" cy="106" rx="2.5" ry="1.5" stroke-width="0.7" opacity="0.6" />
			<rect x="15" y="125" width="110" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 22 132 Q 70 128 118 134" stroke-width="0.8" opacity="0.6" />
			<path d="M 22 137 Q 65 140 118 136" stroke-width="0.8" opacity="0.45" />
			<path d="M 22 142 Q 75 141 118 143" stroke-width="0.8" opacity="0.55" />
			<rect x="133" y="125" width="52" height="22" rx="1.5" stroke-width="1.8" />
			<path d="M 140 132 Q 158 130 178 133" stroke-width="0.8" opacity="0.55" />
			<path d="M 140 137 Q 156 139 178 136" stroke-width="0.8" opacity="0.45" />
			<path d="M 140 142 Q 158 141 178 143" stroke-width="0.8" opacity="0.55" />
		</g>
	</svg>
{:else if material === 'rubber'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g fill="currentColor">
			<circle cx="40" cy="45" r="3" /><circle cx="62" cy="50" r="3" />
			<circle cx="84" cy="45" r="3" /><circle cx="106" cy="48" r="3" />
			<circle cx="128" cy="45" r="3" /><circle cx="150" cy="50" r="3" />
			<circle cx="35" cy="72" r="3" /><circle cx="57" cy="76" r="3" />
			<circle cx="79" cy="72" r="3" /><circle cx="101" cy="75" r="3" />
			<circle cx="123" cy="72" r="3" /><circle cx="145" cy="76" r="3" />
			<circle cx="40" cy="100" r="3" /><circle cx="62" cy="104" r="3" />
			<circle cx="84" cy="100" r="3" /><circle cx="106" cy="103" r="3" />
			<circle cx="128" cy="100" r="3" /><circle cx="150" cy="104" r="3" />
			<circle cx="45" cy="128" r="3" /><circle cx="67" cy="132" r="3" />
			<circle cx="89" cy="128" r="3" /><circle cx="111" cy="130" r="3" />
			<circle cx="133" cy="128" r="3" /><circle cx="155" cy="132" r="3" />
			<circle cx="38" cy="155" r="3" /><circle cx="60" cy="159" r="3" />
			<circle cx="82" cy="155" r="3" /><circle cx="104" cy="158" r="3" />
			<circle cx="126" cy="155" r="3" /><circle cx="148" cy="159" r="3" />
		</g>
	</svg>
{:else if material === 'ceramic'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square">
			<rect x="30" y="42" width="42" height="42" />
			<rect x="78" y="42" width="42" height="42" />
			<rect x="126" y="42" width="42" height="42" />
			<rect x="30" y="90" width="42" height="42" />
			<g transform="translate(99, 111) rotate(45)">
				<rect x="-21" y="-21" width="42" height="42" />
			</g>
			<rect x="126" y="90" width="42" height="42" />
			<rect x="30" y="138" width="42" height="42" />
			<rect x="78" y="138" width="42" height="42" />
			<rect x="126" y="138" width="42" height="42" />
		</g>
	</svg>
{:else if material === 'sheet'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<line x1="30" y1="20" x2="30" y2="120" stroke-width="1.5" opacity="0.5" />
			<line x1="60" y1="20" x2="60" y2="120" stroke-width="0.6" opacity="0.25" />
			<line x1="90" y1="20" x2="90" y2="120" stroke-width="0.6" opacity="0.25" />
			<line x1="120" y1="20" x2="120" y2="120" stroke-width="0.6" opacity="0.25" />
			<line x1="150" y1="20" x2="150" y2="120" stroke-width="0.6" opacity="0.25" />
			<line x1="180" y1="20" x2="180" y2="120" stroke-width="0.6" opacity="0.25" />
			<path d="M 30 90 L 30 110 Q 30 130 50 130 L 180 130" stroke-width="2.4" />
			<line
				x1="30"
				y1="90"
				x2="180"
				y2="90"
				stroke-width="1.2"
				opacity="0.7"
				stroke-dasharray="3 2"
			/>
			<line x1="30" y1="130" x2="180" y2="130" stroke-width="2.4" />
			<line x1="50" y1="148" x2="180" y2="148" stroke-width="0.8" opacity="0.4" />
			<line x1="60" y1="166" x2="180" y2="166" stroke-width="0.8" opacity="0.3" />
			<line
				x1="105"
				y1="130"
				x2="105"
				y2="180"
				stroke-width="0.7"
				opacity="0.5"
				stroke-dasharray="2 2"
			/>
			<line x1="55" y1="138" x2="170" y2="138" stroke-width="1" opacity="0.65" />
		</g>
	</svg>
{:else if material === 'matting'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<rect x="22" y="32" width="156" height="136" rx="3" stroke-width="1.6" />
			<line x1="28" y1="44" x2="172" y2="44" stroke-width="1.6" />
			<line x1="28" y1="58" x2="172" y2="58" stroke-width="1.6" />
			<line x1="28" y1="72" x2="172" y2="72" stroke-width="1.6" />
			<line x1="28" y1="86" x2="172" y2="86" stroke-width="1.6" />
			<line x1="28" y1="100" x2="172" y2="100" stroke-width="1.6" />
			<line x1="28" y1="114" x2="172" y2="114" stroke-width="1.6" />
			<line x1="28" y1="128" x2="172" y2="128" stroke-width="1.6" />
			<line x1="28" y1="142" x2="172" y2="142" stroke-width="1.6" />
			<line x1="28" y1="156" x2="172" y2="156" stroke-width="1.6" />
			<g stroke-width="0.7" opacity="0.6">
				<line x1="40" y1="51" x2="40" y2="55" />
				<line x1="56" y1="51" x2="56" y2="55" />
				<line x1="72" y1="51" x2="72" y2="55" />
				<line x1="88" y1="51" x2="88" y2="55" />
				<line x1="104" y1="51" x2="104" y2="55" />
				<line x1="120" y1="51" x2="120" y2="55" />
				<line x1="136" y1="51" x2="136" y2="55" />
				<line x1="152" y1="51" x2="152" y2="55" />
				<line x1="40" y1="79" x2="40" y2="83" />
				<line x1="56" y1="79" x2="56" y2="83" />
				<line x1="72" y1="79" x2="72" y2="83" />
				<line x1="88" y1="79" x2="88" y2="83" />
				<line x1="104" y1="79" x2="104" y2="83" />
				<line x1="120" y1="79" x2="120" y2="83" />
				<line x1="136" y1="79" x2="136" y2="83" />
				<line x1="152" y1="79" x2="152" y2="83" />
				<line x1="40" y1="107" x2="40" y2="111" />
				<line x1="56" y1="107" x2="56" y2="111" />
				<line x1="72" y1="107" x2="72" y2="111" />
				<line x1="88" y1="107" x2="88" y2="111" />
				<line x1="104" y1="107" x2="104" y2="111" />
				<line x1="120" y1="107" x2="120" y2="111" />
				<line x1="136" y1="107" x2="136" y2="111" />
				<line x1="152" y1="107" x2="152" y2="111" />
				<line x1="40" y1="135" x2="40" y2="139" />
				<line x1="56" y1="135" x2="56" y2="139" />
				<line x1="72" y1="135" x2="72" y2="139" />
				<line x1="88" y1="135" x2="88" y2="139" />
				<line x1="104" y1="135" x2="104" y2="139" />
				<line x1="120" y1="135" x2="120" y2="139" />
				<line x1="136" y1="135" x2="136" y2="139" />
				<line x1="152" y1="135" x2="152" y2="139" />
			</g>
		</g>
	</svg>
{:else if material === 'more'}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<rect x="22" y="22" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" />
			<line x1="32" y1="86" x2="32" y2="40" stroke-width="0.7" opacity="0.55" />
			<line x1="42" y1="86" x2="42" y2="36" stroke-width="0.7" opacity="0.55" />
			<line x1="52" y1="86" x2="52" y2="42" stroke-width="0.7" opacity="0.55" />
			<line x1="62" y1="86" x2="62" y2="38" stroke-width="0.7" opacity="0.55" />
			<line x1="72" y1="86" x2="72" y2="40" stroke-width="0.7" opacity="0.55" />
			<line x1="82" y1="86" x2="82" y2="36" stroke-width="0.7" opacity="0.55" />
			<rect x="104" y="22" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="112" y="30" width="26" height="26" stroke-width="0.7" opacity="0.55" />
			<rect x="144" y="30" width="26" height="26" stroke-width="0.7" opacity="0.55" />
			<rect x="112" y="62" width="26" height="26" stroke-width="0.7" opacity="0.55" />
			<rect x="144" y="62" width="26" height="26" stroke-width="0.7" opacity="0.55" />
			<rect x="22" y="104" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="30" y="114" width="58" height="14" stroke-width="0.7" opacity="0.55" />
			<rect x="30" y="132" width="58" height="14" stroke-width="0.7" opacity="0.55" />
			<rect x="30" y="150" width="58" height="14" stroke-width="0.7" opacity="0.55" />
			<rect x="104" y="104" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" />
			<g fill="currentColor" stroke="none" opacity="0.7">
				<circle cx="118" cy="118" r="2" />
				<circle cx="135" cy="120" r="2" />
				<circle cx="152" cy="118" r="2" />
				<circle cx="169" cy="120" r="2" />
				<circle cx="118" cy="135" r="2" />
				<circle cx="135" cy="137" r="2" />
				<circle cx="152" cy="135" r="2" />
				<circle cx="169" cy="137" r="2" />
				<circle cx="118" cy="152" r="2" />
				<circle cx="135" cy="154" r="2" />
				<circle cx="152" cy="152" r="2" />
				<circle cx="169" cy="154" r="2" />
				<circle cx="118" cy="169" r="2" />
				<circle cx="135" cy="171" r="2" />
				<circle cx="152" cy="169" r="2" />
				<circle cx="169" cy="171" r="2" />
			</g>
			<line
				x1="100"
				y1="86"
				x2="100"
				y2="114"
				stroke-width="2.6"
				stroke-linecap="round"
				opacity="0.85"
			/>
			<line
				x1="86"
				y1="100"
				x2="114"
				y2="100"
				stroke-width="2.6"
				stroke-linecap="round"
				opacity="0.85"
			/>
		</g>
	</svg>
{:else}
	<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g stroke="currentColor" fill="none">
			<rect x="30" y="42" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="78" y="42" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="126" y="42" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="30" y="90" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="78" y="90" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="126" y="90" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="30" y="138" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="78" y="138" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
			<rect x="126" y="138" width="42" height="42" rx="3" stroke-width="1.4" opacity="0.5" />
		</g>
	</svg>
{/if}
