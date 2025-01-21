import chromeP from 'webext-polyfill-kinda';

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
