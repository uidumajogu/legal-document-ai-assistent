<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
</script>

<main class="h-screen w-screen bg-stone-100">
	<nav class="flex h-[2.8rem] items-center justify-center border-b border-stone-300 px-8">
		<div class="flex items-center gap-x-2">
			<Logo />
			<h1 class="text-xl leading-none font-light">Legal Document AI Assistant</h1>
		</div>
	</nav>

	<section class="h-[calc(100%-2.8rem)] w-full overflow-y-auto pt-8">
		<div class="mx-auto w-full max-w-[1440px]"></div>
	</section>
</main>
