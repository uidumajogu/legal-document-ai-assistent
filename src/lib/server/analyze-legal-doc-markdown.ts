import { googleGemini2_5FlashLite } from '$lib/server/config/gemini';
import { generateObject } from 'ai';
import z from 'zod';

const outputSchema = z.object({
	name: z.string().describe('A descriptive name for the legal document.'),
	isLegalDocument: z.boolean().describe('Whether the document is a legal document or not.')
});

const systemPrompt = `
You are a legal expert who is expert in legal document analysis.\nYour SOLE task is to generate a descriptive name for any legal document, and must have the type of legal document and if from an organization must have the name of the organization. Your job is to ensure that the name is descriptive and easy to understand the type of document and from who it is from.

Also confirm if it is a legal document or not.
`;

export default async function analyzeLegalDocMarkdown(markdown: string) {
	try {
		const result = await generateObject({
			model: googleGemini2_5FlashLite,
			system: systemPrompt,
			schema: outputSchema,
			prompt: `Analyze the following legal document and generate a descriptive name for it:\n\n
            **LEGAL DOCUMENT:**\n
            ${markdown}`
		});

		return {
			result: result.object
		};
	} catch (error) {
		return {
			error: (error as Error).message
		};
	}
}
