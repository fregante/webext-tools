import chromeP from 'webext-polyfill-kinda';

/* Throws an error due to misconfiguration, unless misconfiguration can't be verified (Firefox cleans the manifest of unknown properties) */
function warnOrThrow(): void {
	const manifest = chrome.runtime.getManifest();

	if (
		!manifest.permissions?.includes('contextMenus')
		// Disable setup error on Firefox Android
		&& !/Android.+Firefox\//.test(navigator.userAgent)
	) {
		throw new Error('webext-permission-toggle requires the `contextMenus` permission');
	}

	console.warn('chrome.contextMenus is not available');
}

export default async function registerContextMenu(
	settings: chrome.contextMenus.CreateProperties & {id: string}): Promise<void> {
	const {onclick, ...nativeSettings} = settings;

	if (!chrome.contextMenus) {
		warnOrThrow();
		return;
	}

	if (onclick) {
		// Deal with it separately because Chrome does not support the prop in service workers
		chrome.contextMenus.onClicked.addListener((
			data: chrome.contextMenus.OnClickData,
			tab?: chrome.tabs.Tab,
		) => {
			if (data.menuItemId === nativeSettings.id) {
				onclick(data, tab!);
			}
		});
	}

	try {
		// Try updating it first. It will fail if missing, so we attempt to create it instead
		// @ts-expect-error wrong types
		// eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
		await chrome.contextMenus.update(nativeSettings.id, nativeSettings);
	} catch {
		// eslint-disable-next-line @typescript-eslint/await-thenable -- wrong types
		await chromeP.contextMenus.create(nativeSettings);
	}
}
