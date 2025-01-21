import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {doesTabExist} from './does-tab-exist.js';

beforeEach(() => {
	chrome.tabs.get.resetHistory();
	// @ts-expect-error wrong types
	chrome.runtime.lastError = undefined;
});

it('returns true if the tab exists', async () => {
	chrome.tabs.get.withArgs(0).yields({});

	await expect(doesTabExist(0)).resolves.toBe(true);
});

it('returns false if the tab doesn’t exist', async () => {
	chrome.tabs.get.withArgs(0).yields(undefined);
	chrome.runtime.lastError = {message: 'Error'};

	await expect(doesTabExist(0)).resolves.toBe(false);
});
