import chromeP from 'webext-polyfill-kinda';
import {executeFunction} from 'webext-content-scripts';
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

		return await executeFunction(target, () => location.href);
	} catch {
		// No host permissions
		return undefined;
	}
}
