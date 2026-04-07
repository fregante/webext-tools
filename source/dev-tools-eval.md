# devToolsEval

Wrapper around the DevTools `eval` function that throws proper errors.

The native `chrome.devtools.inspectedWindow.eval` reports errors via a callback argument rather than rejecting the promise. This utility normalizes that behavior by throwing an `Error` when the DevTools API returns an error object.

```js
import devToolsEval from 'webext-tools/dev-tools-eval.js';

const result = await devToolsEval('document.title');
```

## Compatibility

- Chrome

## Permissions

- `devtools_page` in `manifest.json`

## Context

- DevTools page / panel

## API

### `devToolsEval<T>(code)`

Evaluates a JavaScript expression in the context of the inspected page and returns the result. Throws an `Error` if the DevTools API reports an error.

#### `code`

The JavaScript expression to evaluate.

## [Main page ⏎](../readme.md)
