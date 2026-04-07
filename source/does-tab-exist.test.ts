import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {doesTabExist} from './does-tab-exist.js';

beforeEach(() => {
	chrome.tabs.get.resetHistory();
});

it('returns true if the tab exists', async () => {
	chrome.tabs.get.withArgs(0).resolves({});

	await expect(doesTabExist(0)).resolves.toBe(true);
});

it('returns false if the tab doesn’t exist', async () => {
	chrome.tabs.get.withArgs(0).rejects(new Error('Tab not found'));

	await expect(doesTabExist(0)).resolves.toBe(false);
});
