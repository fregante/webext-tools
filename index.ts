import chromeP from 'webext-polyfill-kinda';
import {executeFunction} from 'webext-content-scripts';

export type Target = {
	tabId: number;
	frameId: number;
};

export function castTarget(target: number | Target): Target {
	return typeof target === 'object'
		? target
		: {
			tabId: target,
			frameId: 0,
		};
}

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

export async function canAccessTab(target: number | Target): Promise<boolean> {
	return executeFunction(castTarget(target), () => true).then(
		() => true,
		() => false,
	);
}

/** Utility to await promises where you only care whether they throw or not */
async function isPromiseFulfilled(promise: Promise<unknown>): Promise<boolean> {
	try {
		await promise;
		return true;
	} catch {
		return false;
	}
}

export async function doesTabExist(tabId: number): Promise<boolean> {
	return isPromiseFulfilled(chromeP.tabs.get(tabId));
}

export function setActionPopup(
	getPopupUrl: (
		tabUrl: string | undefined,
	) => Promise<string | undefined>,
): void {
	chrome.tabs.onActivated.addListener(async activeInfo => {
		const tab = await chromeP.tabs.get(activeInfo.tabId);

		await chromeP.browserAction.setPopup({
			popup: await getPopupUrl(tab.url) ?? '',
			tabId: tab.id,
		});
	});

	chrome.windows.onFocusChanged.addListener(async windowId => {
		const [tab] = await chromeP.tabs.query({
			active: true,
			windowId,
		});

		if (!tab) {
			return;
		}

		await chromeP.browserAction.setPopup({
			popup: await getPopupUrl(tab.url) ?? '',
			tabId: tab.id,
		});
	});

	chromeP.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (tab.active && changeInfo.url) {
			await chromeP.browserAction.setPopup({
				popup: await getPopupUrl(tab.url) ?? '',
				tabId,
			});
		}
	});
}
