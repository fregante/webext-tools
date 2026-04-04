import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {getExtensionUrl} from './get-extension-url.js';

beforeEach(() => {
	chrome.runtime.getURL.resetHistory();
});

it('returns a URL from a plain pathname string', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl('/page.html')).toBe('chrome-extension://abc/page.html');
});

it('returns a URL from an object with only pathname', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl({pathname: '/page.html'})).toBe('chrome-extension://abc/page.html');
});

it('appends a hash when provided in the options object', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl({pathname: '/page.html', hash: 'section'})).toBe(
		'chrome-extension://abc/page.html#section',
	);
});

it('appends search params when provided as a record in the options object', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl({pathname: '/page.html', searchParams: {foo: 'bar', baz: 'qux'}})).toBe(
		'chrome-extension://abc/page.html?foo=bar&baz=qux',
	);
});

it('appends both hash and search params when both are provided', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(
		getExtensionUrl({pathname: '/page.html', hash: 'section', searchParams: {foo: 'bar'}}),
	).toBe('chrome-extension://abc/page.html?foo=bar#section');
});
