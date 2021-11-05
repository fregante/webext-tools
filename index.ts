import chromeP from 'webext-polyfill-kinda';
import {executeFunction} from 'webext-content-scripts';

interface Target {
	tabId: number;
	frameId: number;
}

export async function getTabUrl(target: number | Target): Promise<string | void> {
	const {frameId, tabId} = typeof target === 'object' ? target : {
		tabId: target,
		frameId: 0,
	};
	try {
		if (frameId === 0) {
			const tab = await chromeP.tabs.get(tabId);
			if (tab.url) {
				return tab.url;
			}
		}

		return await executeFunction(target, () => location.href);
	} catch {
		// No host permissions
	}
}
