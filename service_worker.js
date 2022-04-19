chrome.action.onClicked.addListener(function (activeTab) {
    chrome.runtime.openOptionsPage();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        grabAndPaint(tabId);
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    createContextMenus();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'update-contextmenus') {
        createContextMenus(sendResponse);
    }
});

chrome.contextMenus.onClicked.addListener(function contextClick(info, tab) {
    let link;
    let [target, type] = info.menuItemId.split('--');
    if (target === 'link-note-page') {
        link = info.pageUrl;
    } else if (target === 'link-note-link') {
        link = info.linkUrl;
    }
    chrome.storage.local.set({
        [link]: {
            url: link,
            domain: info.pageUrl,
            type
        }
    }, () => {
        grabAndPaint(tab.id);
    });
});

function createContextMenus(callback) {
    chrome.contextMenus.removeAll(() => {
        chrome.storage.local.get('$config.types$', results => {
            let types = results['$config.types$'];
            for (let t in types) {
                let type = types[t];
                chrome.contextMenus.create({
                    id: `link-note-link--${type.type}`,
                    title: `${chrome.i18n.getMessage('noteThisLink')} - ${type.type}`,
                    contexts: ['link'],
                    targetUrlPatterns: [
                        '*://*/*'
                    ]
                });
                chrome.contextMenus.create({
                    id: `link-note-page--${type.type}`,
                    title: `${chrome.i18n.getMessage('noteThisPage')} - ${type.type}`,
                    contexts: ['page'],
                    targetUrlPatterns: [
                        '*://*/*'
                    ]
                });
            }
            if (typeof callback === 'function') callback();
        });
    });
}

function paint(links) {
    chrome.storage.local.get('$config.types$', results => {
        let types = results['$config.types$'];
        for (let element of document.links) {
            if (!(element.href in links)) continue;
            let link = links[element.href];
            let type = types[link.type];
            element.style.color = type.color;
            console.log(type.color);
            console.log(type);
            if (type.bold) element.style.fontWeight = 'bold';
        }
    });
}

function grab() {
    return [...document.links].map(link => link.href);
}

function grabAndPaint(tabId) {
    chrome.scripting.executeScript({
        target: { tabId },
        function: grab
    }, returneds => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        }
        if (!returneds || returneds.length < 1) return;
        let links = returneds[0].result;
        chrome.storage.local.get(links, indb => {
            chrome.scripting.executeScript({
                target: { tabId },
                function: paint,
                args: [
                    indb
                ]
            }, returneds => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                }
            });
        });
    });
}