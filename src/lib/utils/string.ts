import { marked } from 'marked';
import DOMPurify from 'dompurify';

function getFirstTwoInitials(sentence: string) {
	const words = sentence.trim().split(' ');

	if (words.length < 2) return words.length > 0 ? words[0].charAt(0).toUpperCase() : '';

	const firstInitial = words[0].charAt(0).toUpperCase();
	const secondInitial = words[1].charAt(0).toUpperCase();

	return `${firstInitial}${secondInitial}`;
}

function parseMarkdown(markdown: string) {
	const parsedMarkdown = marked.parse(
		// eslint-disable-next-line no-misleading-character-class
		markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
	) as string;

	return DOMPurify.sanitize(parsedMarkdown);
}

const stringUtil = {
	getFirstTwoInitials,
	parseMarkdown
};
export default stringUtil;
