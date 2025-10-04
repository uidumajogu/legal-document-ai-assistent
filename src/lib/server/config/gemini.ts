import { GOOGLE_GENERATIVE_AI_API_KEY } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleGenerativeAI = createGoogleGenerativeAI({
	apiKey: GOOGLE_GENERATIVE_AI_API_KEY
});

export const googleGemini2_5FlashLite = googleGenerativeAI('gemini-2.5-flash-lite');
