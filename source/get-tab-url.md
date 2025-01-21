# getTabUrl

A no-error function to retrieve a tab or frame’s URL with a plain `activeTab` permission (or regular host/`tabs` permissions).

```js
import {getTabUrl} from 'webext-tools';

const tabId = 42;
const url = await getTabUrl(tabId);
if (url) {
	console.log('The url is', url);
} else {
	console.warn('We have no access to the tab');
}
```

```js
import {getTabUrl} from 'webext-tools';

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

## Compatibility

- Any browser

## Permissions

- Any host access (specific `host_permissions`, or `tabs` permission, or `activeTab` when granted, …)
- `scripting` permission to get the URL of `activeTab`

## Context

- Any contexts with `chrome.tabs` or `chrome.scripting` access (i.e. not the content script)

## API

### `getTabUrl(target)`

Returns a promise that resolves to the URL of the tab or frame, or `undefined` if the target doesn't exist or we don't have permission to access it.

#### `target`

Can be either a `number` or an object with `tabId` and `frameId` properties.

```js
target = 42;
```

```js
target = {
	tabId: 42,
	frameId: 56,
}
```

## [Main page ⏎](../readme.md)
