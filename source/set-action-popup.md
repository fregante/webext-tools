# setActionPopup

Sets the popup URL (or removes the popup) depending on the current tab. This listens to tab changes and it will call the `getPopupUrl` callback to let you determine what popup to show. The callback can also be an async function.

This can be combined with `chrome.action.onClicked` to toggle between callback and popup.

```js
import {setActionPopup} from 'webext-tools';

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({url: 'https://www.google.com', openerTabId});
});
setActionPopup(tabUrl => {
	return String(tabUrl).startsWith('https://www.google.com')
		? './google-popup.html'
		: undefined;
})
```

## Compatibility

- Any browser

## Permissions

- Any `host_permissions`, `optional_host_permissions`, or `tabs` permission

## Context

- Background

## API

### `setActionPopup(getPopupUrl)`

Registers the `getPopupUrl` handler on tab changes.

#### `getPopupUrl`

A function that returns the popup URL or `undefined` to remove the popup.

```js
const getPopupUrl = tabUrl => {
	return String(tabUrl).startsWith('https://google.com')
		? './google-popup.html'
		: undefined;
}
```

The function can also be async, but the longer it takes, the more chances of race conditions you will have.

## [Main page ⏎](../readme.md)
