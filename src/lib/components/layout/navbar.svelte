<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { cn } from '$lib/utils/cn';

	const { class: className = '' }: { class?: string } = $props();
</script>

<nav
	class={cn(
		'flex h-[2.8rem] items-center justify-center border-b border-stone-300 px-8',
		className
	)}
>
	<div class="flex items-center gap-x-2">
		<Logo />
		<h1 class="text-xl leading-none font-light">Legal Document AI Assistant</h1>
	</div>
</nav>
