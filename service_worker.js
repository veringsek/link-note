chrome.action.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
        url: `https://github.com/veringsek/link-note`
    });
});

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.contextMenus.create({
        id: 'link-note-link',
        title: chrome.i18n.getMessage('noteThisLink'),
        contexts: ['link'],
        targetUrlPatterns: [
            '*://*/*'
        ]
    });
    chrome.contextMenus.create({
        id: 'link-note-page',
        title: chrome.i18n.getMessage('noteThisPage'),
        contexts: ['link'],
        targetUrlPatterns: [
            '*://*/*'
        ]
    });
});

chrome.contextMenus.onClicked.addListener(function contextClick(info, tab) {
    let link;
    if (info.menuItemId === 'link-note-page') {
        link = info.pageUrl;
    } else if (info.menuItemId === 'link-note-link') {
        link = info.linkUrl;
    }
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: paint,
        args: [
            [link]
        ]
    }, returnData => null);
});

function paint(links) {
    for (let element of document.links) {
        if (links.includes(element.href)) {
            element.style.color = '#FF0000';
            element.style.fontWeight = 'bold';
        }
    }
}