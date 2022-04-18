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

function showTypes() {
    chrome.storage.local.get('$config.types$', results => {
        for (let tr of [...tbodyTypes.children]) {
            if (tr !== trNewType) {
                tbodyTypes.removeChild(tr);
            }
        }
        let types = results['$config.types$'];
        for (let t in types) {
            let type = types[t];
            let tr = common.createElement('tr', {}, tbodyTypes);
            let tdType = common.createElement('td', {}, tr);
            tdType.innerHTML = type.type;
            let tdDesc = common.createElement('td', {}, tr);
            tdDesc.innerHTML = type.desc;
            let tdColor = common.createElement('td', {}, tr);
            let clrColor = common.createElement('input', {
                type: 'color', 
                disabled: true
            }, tdColor);
            clrColor.value = type.color;
            let tdBold = common.createElement('td', {}, tr);
            let chkBold = common.createElement('input', {
                type: 'checkbox', 
                disabled: true
            }, tdBold);
            chkBold.checked = type.bold;
            let tdBackground = common.createElement('td', {}, tr);
            let clrBackground = common.createElement('input', {
                type: 'color', 
                disabled: true
            }, tdBackground);
            clrBackground.value = type.background;
        }
    });
}

function newType() {
    let type = txtNewTypeType.value;
    if (type === '') return;
    let desc = txtNewTypeDesc.value;
    let color = clrNewTypeColor.value;
    let bold = chkNewTypeBold.checked;
    let background = clrNewTypeBackground.value;
    chrome.storage.local.get({
            '$config.types$': {}
    }, results => {
        let types = results['$config.types$'];
        types[type] = {
            type,
            desc,
            color,
            bold,
            background
        };
        chrome.storage.local.set({
            '$config.types$': types
        }, showTypes);
    });
}

document.getElementById('btnExport').addEventListener('click', exportData);
document.getElementById('btnImport').addEventListener('click', importData);
document.getElementById('btnNewType').addEventListener('click', newType);

window.addEventListener('load', ev => {
    chrome.storage.local.get(null, data => {
        let tbodyData = document.getElementById('tbodyData');
        for (let n in data) {
            let note = data[n];
            let tr = common.createElement('tr', {}, tbodyData);
            let tdType = common.createElement('td', {}, tr);
            tdType.innerHTML = note.type;
            let tdUrl = common.createElement('td', {}, tr);
            tdUrl.innerHTML = note.url;
            let tdDomain = common.createElement('td', {}, tr);
            tdDomain.innerHTML = note.domain;
        }
    });
    showTypes();
});