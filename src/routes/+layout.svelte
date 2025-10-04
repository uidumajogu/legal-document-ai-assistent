<script lang="ts">
	import Navbar from '$lib/components/layout/navbar.svelte';
	import '../app.css';

	const { children } = $props();
</script>

<main class="h-screen w-screen bg-stone-100 text-stone-950">
	<Navbar class="h-[2.8rem]" />

	<section class="h-[calc(100%-2.8rem)] w-full overflow-y-auto">
		{@render children?.()}
	</section>
</main>
