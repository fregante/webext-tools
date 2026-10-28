import assert from 'node:assert/strict';
import {it, beforeEach} from 'node:test';
import chrome from 'sinon-chrome';
import doesTabExist from './does-tab-exist.ts';

beforeEach(() => {
	chrome.tabs.get.resetHistory();
});

it('returns true if the tab exists', async () => {
	chrome.tabs.get.withArgs(0).resolves({});

	assert.equal(await doesTabExist(0), true);
});

it('returns false if the tab doesn’t exist', async () => {
	chrome.tabs.get.withArgs(0).rejects(new Error('Tab not found'));

	assert.equal(await doesTabExist(0), false);
});
