chrome.action.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
        url: `https://github.com/veringsek/link-note`
    });
});
chrome.contextMenus.create({
    title: 'KKK', 
    contexts: ['all'], 
    onclick: function () {
        alert('kkkkkk');
    }
});