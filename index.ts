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
	) => Promise<string | undefined> | string | undefined,
): void {
	const browserAction = chrome.action ?? chromeP.browserAction;

	const setOnActiveTab = async (windowId?: number) => {
		const [tab] = await chromeP.tabs.query({
			active: true,
			...windowId ? {windowId} : {lastFocusedWindow: true},
		});

		if (!tab) {
			return;
		}

		await browserAction.setPopup({
			popup: await getPopupUrl(tab.url) ?? '',
			tabId: tab.id,
		});
	};

	void setOnActiveTab();

	chrome.windows.onFocusChanged.addListener(setOnActiveTab);

	chrome.tabs.onActivated.addListener(async activeInfo => {
		const tab = await chromeP.tabs.get(activeInfo.tabId);

		await browserAction.setPopup({
			popup: await getPopupUrl(tab.url) ?? '',
			tabId: tab.id,
		});
	});

	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (tab.active && changeInfo.url) {
			await browserAction.setPopup({
				popup: await getPopupUrl(tab.url) ?? '',
				tabId,
			});
		}
	});
}

const optionsShortcut = 'WEBEXT_TOOLS_OPTIONS';

function onContextMenuClick({menuItemId}: chrome.contextMenus.OnClickData): void {
	if (menuItemId === optionsShortcut) {
		void chrome.runtime.openOptionsPage();
	}
}
