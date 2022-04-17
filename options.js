function exportData() {
    chrome.storage.local.get(null, data => {
        document.getElementById('txtData').value = JSON.stringify(data);
    });
}

document.getElementById('btnExport').addEventListener('click', exportData);
document.getElementById('btnImport').addEventListener('click', exportData);