import {patternToRegex} from 'webext-patterns';

export async function getTabsByUrl(matches: string[], excludeMatches?: string[]): Promise<number[]> {
	if (matches.length === 0) {
		return [];
	}

	const exclude = excludeMatches ? patternToRegex(...excludeMatches) : undefined;

	const tabs = await chrome.tabs.query({url: matches});
	return tabs
		.filter(tab => tab.id && tab.url && (exclude ? !exclude.test(tab.url) : true))
		.map(tab => tab.id!);
}
