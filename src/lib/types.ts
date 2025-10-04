import type { zLegalDocUploadResponseData } from '$lib/zod-schemas';
import type z from 'zod';

export type LegalDocUploadResponseData = z.infer<typeof zLegalDocUploadResponseData>;
