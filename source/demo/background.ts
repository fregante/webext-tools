import {setActionPopup, createContextMenu} from 'webext-tools';
import popupUrl from 'url:./example-popup.html';

setActionPopup(tabUrl =>
	String(tabUrl).includes('example.com')
		? popupUrl
		: undefined,
);

chrome.action.onClicked.addListener(({openerTabId}) => {
	void chrome.tabs.create({url: 'https://example.com', openerTabId});
});

(async () => {
	await createContextMenu({
		id: 'example-context-menu',
		title: 'Open example.org',
		contexts: ['action'],
		onclick(_, tab) {
			void chrome.tabs.create({url: 'https://example.org', openerTabId: tab.id});
		},
	});

	console.log('Context menu created');

	await createContextMenu({
		id: 'example-context-menu',
		title: 'Open example.org!',
		contexts: ['action'],
		onclick(_, tab) {
			void chrome.tabs.create({url: 'https://example.org', openerTabId: tab.id});
		},
	});

	console.log('Context menu overridden without issue');
})();
