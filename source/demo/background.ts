import popupUrl from 'url:./example-popup.html';
import setActionPopup from '../set-action-popup.js';
import createContextMenu from '../create-context-menu.js';

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

	await createContextMenu({
		id: 'google-context-menu',
		title: 'Open Google',
		contexts: ['action'],
		onclick(_, tab) {
			void chrome.tabs.create({url: 'https://google.com', openerTabId: tab.id});
		},
	});

	console.log('Second menu created');
})();
