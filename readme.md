# webext-tools [![npm version](https://img.shields.io/npm/v/webext-tools.svg)](https://www.npmjs.com/package/webext-tools)

> Utility functions for Web Extensions

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3
- Permissions: In manifest v3, you'll need the `scripting` permission
- Context: They can be called from any context that has access to the `chrome.tabs` or `chrome.scripting` APIs

**Sponsored by [PixieBrix](https://www.pixiebrix.com)** :tada:

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-tools&name=window) and include it in your `manifest.json`. Or use npm:

```sh
npm install webext-tools
```

```js
// This module is only offered as a ES Module
import {getTabUrl, canAccessTab} from 'webext-tools';
```

## Usage

### `getTabUrl(tabId)`
### `getTabUrl({tabId, frameId})`

A no-error function to retrieve a tab or frame’s URL with a plain `activeTab` permission (or regular host/`tabs` permissions).

```js
const tabId = 42;
const url = await getTabUrl(tabId);
if (url) {
	console.log('The url is', url);
} else {
	console.warn('We have no access to the tab');
}
```

```js
const url = await getTabUrl({
	tabId: 42,
	frameId: 56,
});
if (url) {
	console.log('The url is', url);
} else {
	console.warn('We have no access to the frame');
}
```

### `canAccessTab(tabId)`
### `canAccessTab({tabId, frameId})`

Checks whether the extension has access to a specific tab or frame (i.e. content scripts are allowed to run), either via `activeTab` permission or regular host permissions.

```js
const tabId = 42;
const access = await canAccessTab(tabId);
if (access) {
	console.log('We can access this tab');
	chrome.tabs.executeScript(tabId, {file: 'my-script.js'});
} else {
	console.warn('We have no access to the tab');
}
```

```js
const access = await canAccessTab({
	tabId: 42,
	frameId: 56,
});
if (access) {
	console.log('We can access this frame');
	chrome.tabs.executeScript(42, {file: 'my-script.js', frameId: 56});
} else {
	console.warn('We have no access to the frame');
}
```

## Related

- [webext-content-scripts](https://github.com/fregante/webext-content-scripts) - Utility functions to inject content scripts in WebExtensions.
- [webext-base-css](https://github.com/fregante/webext-base-css) - Extremely minimal stylesheet/setup for Web Extensions’ options pages (also dark mode)
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-detect-page](https://github.com/fregante/webext-detect-page) - Detects where the current browser extension code is being run.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on domains added via permission.request
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
