import {expect} from 'vitest';
import chrome from 'sinon-chrome';

/* eslint-disable unicorn/no-global-object-property-assignment -- Test setup */
globalThis.chrome = chrome;

chrome.action = chrome.browserAction;
/* eslint-enable unicorn/no-global-object-property-assignment */

const sleep = async ms => new Promise(resolve => {
	setTimeout(resolve, ms, ms);
});

expect.extend({
	async toBePending(promise) {
		const result = await Promise.race([promise, sleep(10)]);
		if (result === 10) {
			return {
				message: () => 'Expected Promise to be pending.',
				pass: true,
			};
		}

		return {
			message: () => 'Expected Promise to be pending, but it resolved.',
			pass: false,
		};
	},
});
