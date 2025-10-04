<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import z from 'zod';
	import { FileUpIcon } from '@lucide/svelte';
	import { zApiJsonResponse, zLegalDocUploadResponseData } from '$lib/zod-schemas';
	import type { LegalDocUploadResponseData } from '$lib/types';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';

	type FileUploadProps = {
		class?: string;
		onUploadFile?: (data: LegalDocUploadResponseData) => void;
	};

	let { class: className = '', onUploadFile }: FileUploadProps = $props();

	let uploadFileInputValue = $state<string>();
	let uploadFileUrl = $state<string>();
	let uploadingFile = $state<boolean>(false);
	let uploadError = $state<string>();

	const isValidUploadFileUrl = $derived.by(() => {
		return z.url().safeParse(uploadFileUrl).success;
	});

	async function handleFileUpload(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const target = event.target as HTMLInputElement;
		const fileList = target.files;
		if (!fileList) return;

		const file = fileList[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		handleUpload(formData);
	}

	function handleFileUrlUpload() {
		if (!uploadFileUrl) return;

		const formData = new FormData();
		formData.append('url', uploadFileUrl);

		handleUpload(formData);
	}

	async function handleUpload(formData: FormData) {
		uploadError = undefined;
		uploadingFile = true;

		try {
			const response = await fetch('/api/legal/doc-upload', {
				method: 'POST',
				body: formData
			});

			const responseJson = await response.json();
			const validatedResponseJson = zApiJsonResponse(zLegalDocUploadResponseData).safeParse(
				responseJson
			);
			if (validatedResponseJson.error) {
				uploadError = z.prettifyError(validatedResponseJson.error);
				return;
			}

			const { data, error } = validatedResponseJson.data;
			if (error) {
				uploadError = error;
				return;
			}

			onUploadFile?.(data!);

			uploadFileInputValue = undefined;
			uploadFileUrl = undefined;
		} catch (error) {
			uploadError = (error as Error).message ?? 'An unknown error occurred';
		} finally {
			uploadingFile = false;
		}
	}
</script>

<div class={cn('relative w-full max-w-[40rem] space-y-4 bg-stone-100 p-2 lg:p-8', className)}>
	{#if uploadingFile}
		<div
			class="absolute inset-0 z-1 flex items-center justify-center gap-x-4 bg-stone-50/80 backdrop-blur-[2px]"
		>
			<RingLoader />
			<p class="text-xs font-medium">Uploading legal document...</p>
		</div>
	{/if}

	<div class="space-y-4">
		<div
			class="relative w-full justify-items-center space-y-4 border border-dashed border-stone-300 px-2 py-8 text-center"
		>
			<FileUpIcon class="size-20 stroke-1 text-stone-400" />

			<p>Drag and drop or click<br />to upload a Legal Document</p>

			<small class="block text-xs text-stone-500">PDF, DOCX or HTML up to 10mb</small>

			<input
				class="absolute inset-0 z-1 cursor-pointer opacity-0"
				type="file"
				accept=".pdf,.docx,.html,.htm,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html"
				bind:value={uploadFileInputValue}
				onchange={handleFileUpload}
			/>
		</div>
	</div>

	<div class="relative flex items-center gap-x-2">
		<input
			class="h-10 w-full border border-stone-300 bg-stone-100 px-4 placeholder:text-stone-400 invalid:border-red-500 focus-visible:border-stone-300 focus-visible:ring-1 focus-visible:ring-stone-500 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500"
			type="url"
			bind:value={uploadFileUrl}
			placeholder="Or enter the Legal Document file URL"
		/>

		<button
			class={cn(
				'absolute right-0 h-full bg-stone-900 p-1 px-8 text-sm text-stone-50 opacity-0 ring-0 transition-opacity duration-300',
				isValidUploadFileUrl && 'opacity-100'
			)}
			type="button"
			onclick={handleFileUrlUpload}
		>
			Upload
		</button>
	</div>

	{#if uploadError}
		<p class="text-sm text-red-500">{uploadError}</p>
	{/if}
</div>
