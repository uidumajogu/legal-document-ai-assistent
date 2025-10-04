import { json, type RequestHandler } from '@sveltejs/kit';
import TurndownService from 'turndown';
import { pdf } from 'pdf-parse';
import mammoth from 'mammoth';
import analyzeLegalDocMarkdown from '$lib/server/analyze-legal-doc-markdown';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const turndown = new TurndownService({
	headingStyle: 'atx',
	codeBlockStyle: 'fenced',
	emDelimiter: '_'
});

turndown.remove([
	'script',
	'style',
	'noscript',
	'iframe',
	'nav',
	'header',
	'footer',
	'aside',
	'form'
]);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const url = formData.get('url') as string | null;

		let buffer: Buffer;
		let contentType: string;

		if (file) {
			buffer = Buffer.from(await file.arrayBuffer());
			contentType = file.type;
		} else if (url) {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch URL: ${response.statusText}`);
			}
			contentType = response.headers.get('content-type')?.split(';')[0] || '';
			buffer = Buffer.from(await response.arrayBuffer());
		} else {
			return json({ error: 'No file or URL provided' }, { status: 400 });
		}

		const markdown = await processBuffer(buffer, contentType);
		if (!markdown) return json({ error: 'Failed to read file' }, { status: 500 });

		const { result, error } = await analyzeLegalDocMarkdown(markdown);
		if (error) return json({ error }, { status: 500 });
		if (!result?.isLegalDocument)
			return json({ error: 'This is not a legal document' }, { status: 400 });

		return json({ data: { name: result.name, markdown } });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};

async function convertPdf(buffer: Buffer): Promise<string> {
	const uint8Array = new Uint8Array(buffer);

	try {
		const data = await pdf(uint8Array);
		return data.text;
	} catch {
		throw new Error('Could not read PDF file.');
	}
}

async function convertDocx(buffer: Buffer): Promise<string> {
	try {
		const result = await mammoth.convertToHtml({ buffer });
		return turndown.turndown(result.value);
	} catch {
		throw new Error('Could not read DOCX file.');
	}
}

function convertHtml(buffer: Buffer): string {
	const html = buffer.toString('utf-8');

	const dom = new JSDOM(html);
	const reader = new Readability(dom.window.document);
	const article = reader.parse();

	if (article && article.content) return turndown.turndown(article.content);

	return turndown.turndown(html);
}

async function processBuffer(buffer: Buffer, contentType: string): Promise<string> {
	if (contentType.includes('pdf')) {
		return convertPdf(buffer);
	} else if (contentType.includes('wordprocessingml') || contentType.includes('docx')) {
		return convertDocx(buffer);
	} else if (contentType.includes('html')) {
		return convertHtml(buffer);
	}
	throw new Error(`Unsupported file type: ${contentType}`);
}
