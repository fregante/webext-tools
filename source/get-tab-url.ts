import {type Target, castTarget} from './target.js';

export async function getTabUrl(
	target: number | Target,
): Promise<string | undefined> {
	const {frameId, tabId} = castTarget(target);
	try {
		if (frameId === 0 && 'tabs' in globalThis.chrome) {
			const tab = await chrome.tabs.get(tabId);
			if (tab.url) {
				return tab.url;
			}
		}

		const [result] = await chrome.scripting.executeScript({
			target: {tabId, frameIds: [frameId]},
			func: () => location.href,
		});
		return result?.result;
	} catch {
		// No host permissions
		return undefined;
	}
}
