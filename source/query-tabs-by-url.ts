import {patternToRegex} from 'webext-patterns';

export default async function queryTabsByUrl(matches: string[], excludeMatches?: string[]): Promise<number[]> {
	if (matches.length === 0) {
		return [];
	}

	const exclude = excludeMatches ? patternToRegex(...excludeMatches) : undefined;

	const tabs = await chrome.tabs.query({url: matches});
	return tabs
		.filter(tab => tab.id !== undefined && tab.url !== undefined && (!exclude?.test(tab.url)))
		.map(tab => tab.id!);
}
