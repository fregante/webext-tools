const listeners = new Map<string | number, ClickListener>();
let isGlobalListenerAdded = false;

export type ClickListener = (
	data: chrome.contextMenus.OnClickData,
	tab: chrome.tabs.Tab,
) => void;

// `create` returns the id synchronously and reports errors via callback only
async function create(properties: chrome.contextMenus.CreateProperties): Promise<void> {
	return new Promise((resolve, reject) => {
		chrome.contextMenus.create(properties, () => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError.message));
			} else {
				resolve();
			}
		});
	});
}

function isDuplicateError(error: string): boolean {
	return (
		error.includes('Cannot create item with duplicate id') // Chrome
		|| error.includes('already exists in menus.create') // Firefox
		|| error.includes('Identifier is already used') // Safari
	);
}

/**
Throws an error due to misconfiguration, unless misconfiguration can't be verified (Firefox cleans the manifest of unknown properties)
*/
export function notifyOfMissingPermissions(): void {
	// Internal check before warning
	if (chrome.contextMenus !== undefined) {
		return;
	}

	const manifest = chrome.runtime.getManifest();

	if (
		!manifest.permissions?.includes('contextMenus')
		// Disable setup error on Firefox Android
		&& !/Android.+Firefox\//v.test(navigator.userAgent)
	) {
		throw new Error('webext-permission-toggle requires the `contextMenus` permission');
	}

	console.warn('chrome.contextMenus is not available');
}

function globalListener(
	data: chrome.contextMenus.OnClickData,
	tab?: chrome.tabs.Tab,
): void {
	listeners.get(data.menuItemId)?.(data, tab!);
}

export default async function createContextMenu(
	settings: Omit<chrome.contextMenus.CreateProperties, 'contexts'> & {
		id: string;
		contexts?: Array<`${chrome.contextMenus.ContextType}`>;
	}): Promise<void> {
	const {onclick, ...menuSettings} = settings;

	if (chrome.contextMenus === undefined) {
		notifyOfMissingPermissions();
		return;
	}

	if (onclick !== undefined) {
		// Deal with it separately because Chrome does not support the prop in service workers.
		// Add single listener or else multiple `create` calls will register multiple listeners.
		// Safari (unlike Chrome/Firefox) does not deduplicate addListener calls, so we guard it manually.
		if (!isGlobalListenerAdded) {
			chrome.contextMenus.onClicked.addListener(globalListener);
			isGlobalListenerAdded = true;
		}

		listeners.set(menuSettings.id, onclick);
	}

	// Don't "remove+create" because this will re-order the items, if other items don't use the same mechanism.
	// Instead, attempt updating it to ensure the last call is always accurate.
	// If it exists:
	// - `update` works
	// - `create` fails and the error is ignored
	// If it doesn't exist:
	// - `update` fails (only in Chrome) and the error is ignored
	// - `create` works
	const {id, ...updateSettings} = menuSettings;

	const [, creation] = await Promise.allSettled([
		chrome.contextMenus.update(id, updateSettings as Omit<chrome.contextMenus.CreateProperties, 'id'>),
		create(menuSettings as chrome.contextMenus.CreateProperties),
	]);

	if (
		creation.status === 'rejected'
		&& !isDuplicateError(String(creation.reason))
	) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error -- It is an error
		throw creation.reason;
	}
}
