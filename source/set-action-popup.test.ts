import {setTimeout} from 'node:timers/promises';
import {
	assert, it, beforeEach, vi,
} from 'vitest';
import chrome from 'sinon-chrome';
import {setActionPopup} from './set-action-popup.js';

// TODO: Extend sinon-chrome types
// @ts-expect-error missing types
chrome.action = chrome.browserAction;

beforeEach(() => {
	// @ts-expect-error missing types
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	chrome.action.setPopup.flush();
	chrome.windows.onFocusChanged.removeListeners();
	chrome.tabs.onActivated.removeListeners();
	chrome.tabs.onUpdated.removeListeners();
	// @ts-expect-error wrong types
	chrome.runtime.lastError = undefined;
});

it('sets the popup on the active tab', async () => {
	const getPopupUrl = vi.fn().mockReturnValue('https://example.com');

	chrome.tabs.query.withArgs({
		active: true,
		lastFocusedWindow: true,
	}).yields([{
		id: 0,
		url: 'https://example.com',
	}]);

	setActionPopup(getPopupUrl);

	// @ts-expect-error missing types
	assert.equal(chrome.action.setPopup.notCalled, true);

	chrome.tabs.onActivated.trigger({tabId: 100});

	await setTimeout(1);

	assert.equal(chrome.tabs.query.calledOnce, true);

	// TODO: Add more tests for the listeners
});
