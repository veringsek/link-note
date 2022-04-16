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
        contexts: ['all'],
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
    chrome.storage.local.set({
        [link]: {
            url: link,
            domain: info.pageUrl,
            note: 1
        }
    }, () => {
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            function: grab
        }, links => {
            console.log(links[0]?.result)
            chrome.storage.local.get(links[0]?.result, indb => {
                console.log(indb)
                chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    function: paint,
                    args: [
                        Object.keys(indb)
                    ]
                }, returnData => null);
            });
        });
    });
});

function paint(links) {
    for (let element of document.links) {
        console.log(links)
        console.log(element.href)
        if (links.includes(element.href)) {
            element.style.color = '#FF0000';
            element.style.fontWeight = 'bold';
        }
    }
}

function grab() {
    return [...document.links].map(link => link.href);
}