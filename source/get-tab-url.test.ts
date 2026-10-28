// Note: These tests aren't great, sinon-chrome doesn't support the scripting API for example

import assert from 'node:assert/strict';
import {it, beforeEach} from 'node:test';
import chrome from 'sinon-chrome';
import getTabUrl from './get-tab-url.ts';

beforeEach(() => {
	chrome.tabs.get.resetHistory();
});

it('returns the tab URL', async () => {
	chrome.tabs.get.withArgs(0).resolves({
		url: 'https://example.com',
	});

	assert.equal(await getTabUrl(0), 'https://example.com');
});

it('returns undefined if the tab doesn’t exist', async () => {
	chrome.tabs.get.withArgs(0).rejects(new Error('Tab not found'));

	assert.equal(await getTabUrl(0), undefined);
});

