// Note: These tests aren't great, sinon-chrome doesn't support the scripting API for example

import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {getTabUrl} from './get-tab-url.js';

beforeEach(() => {
	chrome.tabs.get.resetHistory();
	// @ts-expect-error wrong types
	chrome.runtime.lastError = undefined;
});

it('returns the tab URL', async () => {
	chrome.tabs.get.withArgs(0).yields({
		url: 'https://example.com',
	});

	await expect(getTabUrl(0)).resolves.toBe('https://example.com');
});

it('returns undefined if the tab doesn’t exist', async () => {
	chrome.tabs.get.withArgs(0).yields(undefined);
	chrome.runtime.lastError = {message: 'Error'};

	await expect(getTabUrl(0)).resolves.toBeUndefined();
});

