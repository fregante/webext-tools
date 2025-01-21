import chromeP from 'webext-polyfill-kinda';
import {getTabUrl} from './get-tab-url.js';

export type GetPopupUrl = (
	tabUrl: string | undefined,
) => Promise<string | undefined> | string | undefined;

async function rawSetPopup(
	getPopupUrl: GetPopupUrl,
	tabId: number,
	url?: string,
): Promise<void> {
	const browserAction = chrome.action ?? chromeP.browserAction;

	await browserAction.setPopup({
		popup: await getPopupUrl(url ?? await getTabUrl(tabId)) ?? '',
		tabId,
	});
}

export function setActionPopup(getPopupUrl: GetPopupUrl): void {
	const setOnActiveTab = async (windowId?: number) => {
		if (windowId === chrome.windows.WINDOW_ID_NONE) {
			return;
		}

		const [tab] = await chromeP.tabs.query({
			active: true,
			...windowId ? {windowId} : {lastFocusedWindow: true},
		});

		if (!tab?.id) {
			return;
		}

		await rawSetPopup(getPopupUrl, tab.id, tab.url);
	};

	// TODO: Probably just call on extension enabled
	void setOnActiveTab();

	chrome.windows.onFocusChanged.addListener(setOnActiveTab);

	chrome.tabs.onActivated.addListener(async activeInfo => {
		await rawSetPopup(getPopupUrl, activeInfo.tabId);
	});

	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (tab.active && changeInfo.url) {
			await rawSetPopup(getPopupUrl, tabId, changeInfo.url);
		}
	});
}
