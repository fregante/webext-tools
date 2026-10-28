import {setTimeout} from 'node:timers/promises';
import {it, beforeEach, type TestContext} from 'node:test';
import chrome from 'sinon-chrome';
import setActionPopup from './set-action-popup.ts';

// TODO: Extend sinon-chrome types
// @ts-expect-error missing types
chrome.action = chrome.browserAction;

beforeEach(() => {
	// @ts-expect-error missing types

	chrome.action.setPopup.flush();
	chrome.windows.onFocusChanged.removeListeners();
	chrome.tabs.onActivated.removeListeners();
	chrome.tabs.onUpdated.removeListeners();
});

it('sets the popup on the active tab', async (t: TestContext) => {
	const getPopupUrl = t.mock.fn(() => 'https://example.com');

	chrome.tabs.query.withArgs({
		active: true,
		lastFocusedWindow: true,
	}).resolves([{
		id: 0,
		url: 'https://example.com',
	}]);

	setActionPopup(getPopupUrl);

	// @ts-expect-error missing types
	t.assert.strictEqual(chrome.action.setPopup.notCalled, true);

	chrome.tabs.onActivated.trigger({tabId: 100});

	await setTimeout(1);

	t.assert.strictEqual(chrome.tabs.query.calledOnce, true);

	// TODO: Add more tests for the listeners
});
