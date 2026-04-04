import chromeP from 'webext-polyfill-kinda';

const listeners = new Map<string | number, ClickListener>();

export type ClickListener = (
	data: chrome.contextMenus.OnClickData,
	tab: chrome.tabs.Tab,
) => void;

function isDuplicateError(error: string): boolean {
	return (
		error.includes('Cannot create item with duplicate id')
		|| error.includes('already exists in menus.create')
	);
}

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

function globalListener(
	data: chrome.contextMenus.OnClickData,
	tab?: chrome.tabs.Tab,
): void {
	listeners.get(data.menuItemId)?.(data, tab!);
}

export async function createContextMenu(
	settings: chrome.contextMenus.CreateProperties & {id: string}): Promise<void> {
	const {onclick, ...createSettings} = settings;

	if (!chrome.contextMenus) {
		warnOrThrow();
		return;
	}

	if (onclick) {
		// Deal with it separately because Chrome does not support the prop in service workers.
		// Add single listener or else multiple `create` calls will register multiple listeners.
		chrome.contextMenus.onClicked.addListener(globalListener);
		listeners.set(createSettings.id, onclick);
	}

	// Don't "remove+create" because this will re-order the items, if other items don't use the same mechanism.
	// Instead, attempt updating it to ensure the last call is always accurate.
	// If it exists:
	// - `update` works
	// - `create` fails and the error is ignored
	// If it doesn't exist:
	// - `update` fails (only in Chrome) and the error is ignored
	// - `create` works
	const {id, ...updateSettings} = createSettings;
	const [, creation] = await Promise.allSettled([
		chromeP.contextMenus.update(id, updateSettings),
		chromeP.contextMenus.create(createSettings),
	]);

	if (
		creation.status === 'rejected'
		&& !isDuplicateError(String(creation.reason))
	) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error -- It is an error
		throw creation.reason;
	}
}
