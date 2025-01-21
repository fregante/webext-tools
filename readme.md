# webext-tools [![npm version](https://img.shields.io/npm/v/webext-tools.svg)](https://www.npmjs.com/package/webext-tools)

> Utility functions for Web Extensions

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3

**Sponsored by [PixieBrix](https://www.pixiebrix.com)** :tada:

## Install

```sh
npm install webext-tools
```

Or download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-tools&name=window) to include in your `manifest.json`.

## Usage

This package exports various utilities, just import what you need.

- [doesTabExist](./source/does-tab-exist.md) - Checks whether the tab exists.
- [getTabUrl](./source/get-tab-url.md) - Retrieves a tab or frame’s URL with a plain `activeTab` permission (or regular host/`tabs` permissions).
- [setActionPopup](./source/set-action-popup.md) - Sets the popup URL (or removes the popup) depending on the current tab.
- `addOptionsContextMenu` was moved to [webext-bugs](https://github.com/fregante/webext-bugs).

## Related

- [webext-events](https://github.com/fregante/webext-events) - High-level events and utilities for events in Web Extensions.
- [webext-base-css](https://github.com/fregante/webext-base-css) - Extremely minimal stylesheet/setup for Web Extensions’ options pages (also dark mode)
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-detect](https://github.com/fregante/webext-detect) - Detects where the current browser extension code is being run.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
