import z from 'zod';

export const zApiJsonResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.union([
		// Success response
		z.object({
			data: dataSchema,
			error: z.optional(z.undefined())
		}),
		// Error response
		z.object({
			data: z.optional(z.undefined()),
			error: z.string()
		})
	]);

export const zLegalDocUploadResponseData = z.object({
	name: z.string(),
	markdown: z.string()
});
