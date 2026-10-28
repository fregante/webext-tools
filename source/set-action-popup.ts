import getTabUrl from './get-tab-url.ts';

export type GetPopupUrl = (
	tabUrl: string | undefined,
) => Promise<string | undefined> | string | undefined;

async function rawSetPopup(
	getPopupUrl: GetPopupUrl,
	tabId: number,
	url?: string,
): Promise<void> {
	await chrome.action.setPopup({
		popup: await getPopupUrl(url ?? await getTabUrl(tabId)) ?? '',
		tabId,
	});
}

export default function setActionPopup(getPopupUrl: GetPopupUrl): void {
	const setOnActiveTab = async (windowId?: number) => {
		if (windowId === chrome.windows.WINDOW_ID_NONE) {
			return;
		}

		const [tab] = await chrome.tabs.query({
			active: true,
			...windowId === undefined ? {lastFocusedWindow: true} : {windowId},
		});

		if (tab?.id === undefined) {
			return;
		}

		await rawSetPopup(getPopupUrl, tab.id, tab.url);
	};

	// TODO: Probably just call on extension enabled
	void setOnActiveTab();

	chrome.windows.onFocusChanged.addListener(windowId => {
		void setOnActiveTab(windowId);
	});

	chrome.tabs.onActivated.addListener(activeInfo => {
		void rawSetPopup(getPopupUrl, activeInfo.tabId);
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (tab.active && changeInfo.url !== undefined) {
			void rawSetPopup(getPopupUrl, tabId, changeInfo.url);
		}
	});
}
