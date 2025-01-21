# doesTabExist

Checks whether the tab exists.

```js
import {doesTabExist} from 'webext-tools';

const tabId = 42;
const tabExists = await doesTabExist(tabId);
if (tabExists) {
	chrome.tabs.remove(tabExists);
}
```

## Compatibility

- Any browser

## Permissions

- No permission necessary

## Context

- Any contexts with `chrome.tabs` (i.e. not the content script)

## API

### `doesTabExist(tabId)`

Return a promise that resolves to `true` if the tab exists or `false` otherwise.

#### `tabId`

The tab ID.

## [Main page ⏎](../readme.md)
