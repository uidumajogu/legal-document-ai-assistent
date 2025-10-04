<script lang="ts">
	import DocUpload from '$lib/components/chat/legal-doc-upload.svelte';
	import ChatLoader from '$lib/components/loaders/chat-loader.svelte';
	import type { LegalDocUploadResponseData } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import stringUtil from '$lib/utils/string';
	import { Chat } from '@ai-sdk/svelte';
	import { SendHorizontalIcon } from '@lucide/svelte';
	import { FileTextIcon } from '@lucide/svelte';

	let input = $state<string>();
	let docData = $state<LegalDocUploadResponseData>();
	let messagesHasFileIncluded = $state(false);

	const chat = new Chat({});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) handleSubmit?.(event);
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!input) return;
		if (!docData) return;

		let docFile: FileList | undefined = undefined;

		if (!messagesHasFileIncluded) {
			docFile = docMarkdownToFileList(docData);
			messagesHasFileIncluded = true;
		}

		chat.sendMessage({ text: input, files: docFile });
		input = undefined;
	}

	function docMarkdownToFileList(docData: LegalDocUploadResponseData) {
		const blob = new Blob([docData.markdown], { type: 'text/markdown' });
		const file = new File([blob], `${docData.name}.md`, { type: 'text/markdown' });

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		return dataTransfer.files;
	}
</script>

{#if !docData}
	<DocUpload class="mx-auto" onUploadFile={(data) => (docData = data)} />
{/if}

{#if !!docData}
	<div class="relative mx-auto min-h-full w-full max-w-[48rem]">
		<div
			class="sticky top-0 z-1 flex items-center gap-x-4 border-b border-stone-300 bg-stone-100 px-2 py-4"
		>
			<FileTextIcon class="size-8 stroke-1 text-stone-400" />
			<h2 class="text-xl font-semibold">{docData.name}</h2>
		</div>

		<ul class="min-h-full pt-4 pb-[100%]">
			{#each chat.messages as message, messageIndex (messageIndex)}
				<li>
					{#if message.role === 'user'}
						<div class="bg-stone-200 px-4 py-2">
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'text'}
									<p>{part.text}</p>
								{/if}
							{/each}
						</div>
					{/if}

					{#if message.role === 'assistant'}
						<div class="pt-2 pb-12">
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'text'}
									<p class="prose prose-sm leading-tight prose-stone">
										{@html stringUtil.parseMarkdown(part.text)}
									</p>
								{/if}
							{/each}
						</div>
					{/if}
				</li>
			{/each}

			{#if chat.status === 'submitted' || chat.status === 'streaming'}
				<ChatLoader />
			{/if}
		</ul>

		<div class="fixed right-0 bottom-0 left-0 z-2 w-full">
			<div class="mx-auto w-full max-w-[48rem] bg-stone-100 pb-4">
				<form class="relative w-full leading-0" onsubmit={handleSubmit}>
					<textarea
						class="field-sizing-content min-h-20 w-full resize-none border border-stone-300 bg-stone-100 px-4 py-2 pb-8 outline-none placeholder:text-stone-500 invalid:border-red-500 focus-visible:border-stone-300 focus-visible:ring-1 focus-visible:ring-stone-500 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500"
						bind:value={input}
						placeholder={`Ask anything about ${docData.name}...`}
						{onkeydown}
					></textarea>

					<button
						class={cn(
							'absolute right-1 bottom-1 hidden size-8 bg-stone-900 p-1 text-stone-50',
							!!input && 'block'
						)}
						type="submit"
						disabled={!input}
					>
						<SendHorizontalIcon class="size-full" />
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
