import {setActionPopup} from 'webext-tools';
import popupUrl from 'url:./example-popup.html';

setActionPopup(tabUrl =>
	String(tabUrl).includes('example.com')
		? popupUrl
		: undefined,
);

chrome.action.onClicked.addListener(({openerTabId}) => {
	void chrome.tabs.create({url: 'https://example.com', openerTabId});
});
