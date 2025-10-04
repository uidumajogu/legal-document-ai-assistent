<script lang="ts">
	import { cn } from '$lib/utils/cn';

	import type { SVGAttributes } from 'svelte/elements';

	const { class: className = '', ...otherSvgAttributes }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg
	class={cn('h-5 w-auto fill-stone-900', className)}
	width="630"
	height="840"
	viewBox="0 0 630 840"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...otherSvgAttributes}
>
	<path d="M262.5 0H0V840H630V367.5H262.5V0Z" fill="inherit" />
	<path d="M367.5 0V262.5H630L367.5 0Z" fill="inherit" />
</svg>
