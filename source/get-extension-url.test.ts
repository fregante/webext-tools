import {expect, it, beforeEach} from 'vitest';
import chrome from 'sinon-chrome';
import {getExtensionUrl} from './get-extension-url.js';

beforeEach(() => {
	chrome.runtime.getURL.resetHistory();
});

it('returns a URL from a plain pathname string', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl('/page.html')).toBeInstanceOf(URL);
	expect(getExtensionUrl('/page.html').href).toBe('chrome-extension://abc/page.html');
});

it('appends a hash when provided as an option', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl('/page.html', {hash: 'section'}).href).toBe(
		'chrome-extension://abc/page.html#section',
	);
});

it('appends search params when provided as a record option', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl('/page.html', {searchParams: {foo: 'bar', baz: 'qux'}}).href).toBe(
		'chrome-extension://abc/page.html?foo=bar&baz=qux',
	);
});

it('appends both hash and search params when both are provided', () => {
	chrome.runtime.getURL.withArgs('/page.html').returns('chrome-extension://abc/page.html');

	expect(getExtensionUrl('/page.html', {hash: 'section', searchParams: {foo: 'bar'}}).href).toBe(
		'chrome-extension://abc/page.html?foo=bar#section',
	);
});
