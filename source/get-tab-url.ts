import chromeP from 'webext-polyfill-kinda';
import {type Target, castTarget} from './target.js';

export async function getTabUrl(
	target: number | Target,
): Promise<string | undefined> {
	const {frameId, tabId} = castTarget(target);
	try {
		if (frameId === 0 && 'tabs' in globalThis.chrome) {
			const tab = await chromeP.tabs.get(tabId);
			if (tab.url) {
				return tab.url;
			}
		}

		if ('scripting' in globalThis.chrome) {
			const [result] = await chrome.scripting.executeScript({
				target: {tabId, frameIds: [frameId]},
				func: () => location.href,
			});
			return result?.result;
		}

		// MV2 fallback
		const results = await chromeP.tabs.executeScript(tabId, {
			frameId,
			code: 'location.href',
		});
		return results?.[0] as string | undefined;
	} catch {
		// No host permissions
		return undefined;
	}
}
