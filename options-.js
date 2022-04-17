function exportData() {
    chrome.storage.local.get(null, data => {
        document.getElementById('txt').innerHTML = JSON.stringify(data);
    });
}

exportData();