# getExtensionUrl

Generates an absolute URL for a resource bundled with the extension, using `runtime.getURL`.

```js
import {getExtensionUrl} from 'webext-tools';

// Simple pathname string (# and ? are blocked by TypeScript types)
const url = getExtensionUrl('/options.html');

// Object form with hash and/or search params
const urlWithHash = getExtensionUrl({pathname: '/options.html', hash: 'section'});
const urlWithSearch = getExtensionUrl({pathname: '/options.html', searchParams: {tab: 'privacy'}});
```

## Compatibility

- Any browser

## Permissions

- No permission necessary

## Context

- Any extension context

## API

### `getExtensionUrl(pathname)`

Accepts a pathname string. TypeScript types block `#` and `?` characters — use the object form to add a hash or search parameters.

#### `pathname`

A path to a resource in the extension bundle (e.g. `'/options.html'`).

---

### `getExtensionUrl(details)`

Accepts an object for when you need to include a hash or search parameters.

#### `details.pathname`

Optional. The path to the resource (e.g. `'options.html'`). Defaults to the extension root.

#### `details.hash`

Optional. The URL fragment, **without** the leading `#` (e.g. `'section'`).

#### `details.searchParams`

Optional. Key-value pairs for the query string (e.g. `{tab: 'privacy'}`). Accepts a `Record<string, string>` to prevent raw query strings like `'tab=privacy&lang=en'`.

## [Main page ⏎](../readme.md)
