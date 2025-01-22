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

export async function createContextMenu(
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
		const {id, ...updateSettings} = nativeSettings;
		// Try updating it first. It will fail if missing, so we attempt to create it instead
		await chromeP.contextMenus.update(id, updateSettings);
		return;
	} catch {}

	try {
		// eslint-disable-next-line @typescript-eslint/await-thenable -- wrong types
		await chromeP.contextMenus.create(nativeSettings);
	} catch (error) {
		// It can still fail due to race conditions
		if (!(error as Error)?.message.startsWith('Cannot create item with duplicate id')) {
			throw error;
		}
	}
}
