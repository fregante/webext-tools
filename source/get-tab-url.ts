import castTarget, {type Target} from './target.ts';

export default async function getTabUrl(
	target: number | Target,
): Promise<string | undefined> {
	const {frameId, tabId} = castTarget(target);
	try {
		if (frameId === 0 && 'tabs' in chrome) {
			const tab = await chrome.tabs.get(tabId);
			if (tab.url !== undefined) {
				return tab.url;
			}
		}

		const [result] = await chrome.scripting.executeScript({
			target: {tabId, frameIds: [frameId]},
			func: () => globalThis.location.href,
		});
		return result?.result;
	} catch {
		// No host permissions
		return undefined;
	}
}
