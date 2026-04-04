# getExtensionUrl

Generates a `URL` for a resource bundled with the extension, using `runtime.getURL`.

```js
import {getExtensionUrl} from 'webext-tools';

// Simple pathname (# and ? are blocked by TypeScript types)
const url = getExtensionUrl('/options.html');

// With hash and/or search params as a second argument
const urlWithHash = getExtensionUrl('/options.html', {hash: 'section'});
const urlWithSearch = getExtensionUrl('/options.html', {searchParams: {tab: 'privacy'}});
```

## Compatibility

- Any browser

## Permissions

- No permission necessary

## Context

- Any extension context

## API

### `getExtensionUrl(pathname, options?)`

Returns a `URL` object for the given extension resource.

#### `pathname`

The path to a resource in the extension bundle (e.g. `'/options.html'`). TypeScript types block `#` and `?` characters — use `options.hash` and `options.searchParams` instead.

#### `options.hash`

Optional. The URL fragment, **without** the leading `#` (e.g. `'section'`).

#### `options.searchParams`

Optional. Key-value pairs for the query string (e.g. `{tab: 'privacy'}`). Accepts a `Record<string, string>` to prevent raw query strings like `'tab=privacy&lang=en'`.

## [Main page ⏎](../readme.md)
