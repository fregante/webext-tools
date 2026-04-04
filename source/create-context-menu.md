# createContextMenu

It wraps `chrome.contextMenus.create` and `chrome.contextMenus.onClicked` and resolves many of its issues:

- it returns a promise (the native one only supports callbacks)
- it does not throw if you call it twice with the same `id`
- it does not throw if the API is not available on the platform (Firefox Android, Safari iOS)
- it does throw helpfully if you forgot to add the `contextMenus` permission
- it enables the `onclick` handler even in service workers

```js
import {createContextMenu} from 'webext-tools';

createContextMenu({
	id: 'example-context-menu',
	title: 'Open example.org',
	contexts: ['action'],
	onclick(_, tab) {
		void chrome.tabs.create({url: 'https://example.org', openerTabId: tab.id});
	},
});
```

## Compatibility

- Any browser

## Permissions

- `contextMenus` permission

## Context

- Background

## API

### `createContextMenu(settings)`

Creates a context menu.

#### `settings`

See the native [CreateProperties](https://developer.chrome.com/docs/extensions/reference/api/contextMenus#type-CreateProperties) type, disregard the "not available" note regarding `onclick` because it works here.

## [Main page ⏎](../readme.md)
