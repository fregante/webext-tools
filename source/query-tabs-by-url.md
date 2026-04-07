# queryTabsByUrl

Returns the IDs of tabs whose URL matches the given patterns.

```js
import queryTabsByUrl from 'webext-tools/query-tabs-by-url';

const tabIds = await queryTabsByUrl(['https://example.com/*']);
console.log('Matching tab IDs:', tabIds);
```

```js
import queryTabsByUrl from 'webext-tools/query-tabs-by-url';

const tabIds = await queryTabsByUrl(['*://*/*'], ['http://*/*']);
console.log('HTTPS-only tab IDs:', tabIds);
```

## Compatibility

- Any browser

## Permissions

- `tabs` permission (to access `tab.url`)

## Context

- Any contexts with `chrome.tabs` access (i.e. not the content script)

## API

### `queryTabsByUrl(matches, excludeMatches?)`

Returns a promise that resolves to an array of tab IDs whose URL matches one of the `matches` patterns and does not match any of the `excludeMatches` patterns.

#### `matches`

An array of [match patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns). If empty, resolves to `[]`.

#### `excludeMatches`

An optional array of match patterns. Tabs whose URL matches any of these patterns are excluded from the result.

## [Main page ⏎](../readme.md)
