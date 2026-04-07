import assert from 'node:assert';
import {describe, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {queryTabsByUrl} from './query-tabs-by-url.js';

const mockTabs = [
	{id: 1, url: 'https://example.com/page'},
	{id: 2, url: 'http://other.com/page'},
];

beforeEach(() => {
	chrome.tabs.query.resetHistory();
	chrome.tabs.query.withArgs({url: ['https://example.com/*']}).resolves([mockTabs[0]]);
	chrome.tabs.query.withArgs({url: ['*://*/*']}).resolves(mockTabs);
	chrome.tabs.query.withArgs({url: ['http://no-way.example.com/*']}).resolves([mockTabs[1]]);
});

describe('queryTabsByUrl', () => {
	it('should handle the matches array', async () => {
		assert.deepEqual(
			await queryTabsByUrl([]),
			[],
			'No patterns means no tabs',
		);
		assert.deepEqual(
			await queryTabsByUrl(['https://example.com/*']),
			[1],
			'It should pass the query to chrome.tabs',
		);
		assert.deepEqual(
			await queryTabsByUrl(['*://*/*']),
			[1, 2],
			'It should pass the query to chrome.tabs',
		);
	});

	it('should handle the `excludeMatches` array', async () => {
		const excludeMatches = ['http://*/*'];
		assert.deepEqual(
			await queryTabsByUrl([], excludeMatches),
			[],
			'No patterns means no tabs',
		);
		assert.deepEqual(
			await queryTabsByUrl(['https://example.com/*'], excludeMatches),
			[1],
			'It should pass the query to chrome.tabs',
		);
		assert.deepEqual(
			await queryTabsByUrl(['*://*/*'], excludeMatches),
			[1],
			'It should exclude tabs with URLs matching `excludeMatches`',
		);
		assert.deepEqual(
			await queryTabsByUrl(['http://no-way.example.com/*'], excludeMatches),
			[],
			'It should exclude tabs with URLs matching `excludeMatches`, even if it\'s the only match',
		);
	});
});
