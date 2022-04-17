function exportData() {
    chrome.storage.local.get(null, data => {
        document.getElementById('txtData').value = JSON.stringify(data);
    });
}

function importData() {
    let txtData = document.getElementById('txtData');
    let data;
    try {
        data = JSON.parse(txtData.value);
    } catch (error) {
        console.log(error);
    }
    chrome.storage.local.clear(() => {
        chrome.storage.local.set(data, () => {
            document.getElementById('txtMessage').innerHTML = 'done';
        });
    });
}

document.getElementById('btnExport').addEventListener('click', exportData);
document.getElementById('btnImport').addEventListener('click', importData);