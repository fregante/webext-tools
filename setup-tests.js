import chrome from 'sinon-chrome';

/* eslint-disable unicorn/no-global-object-property-assignment -- Test setup */
globalThis.chrome = chrome;

chrome.action = chrome.browserAction;
/* eslint-enable unicorn/no-global-object-property-assignment */
