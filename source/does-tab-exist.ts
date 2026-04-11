/** Utility to await promises where you only care whether they throw or not */
async function isPromiseFulfilled(promise: Promise<unknown>): Promise<boolean> {
	try {
		await promise;
		return true;
	} catch {
		return false;
	}
}

export default async function doesTabExist(tabId: number): Promise<boolean> {
	return isPromiseFulfilled(chrome.tabs.get(tabId));
}
