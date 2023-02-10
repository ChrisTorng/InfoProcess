const history = document.getElementById('history');
const sourceElement = document.getElementById('source');

quickSummary(sourceElement.value);

function quickSummary(source) {
    source = source.substring(source.indexOf('please-bird-mindfully') + 'please-bird-mindfully'.length + 2);
    source = source.substring(0, source.indexOf('***********') - 2);
    var records = source.split('\n\n');
    appendHistory(records[0]);
    appendHistory(getRecord(records[0]));
    appendHistory(getRecord(records[1]));
    appendHistory(getRecord(records[2]));
}

function getRecord(record) {
    var lines = record.split('\n');
    var name = lines[0];
    var place = lines[2].substring(2);
    var mapUrl = lines[3].substring(6);
    var recordUrl = lines[4].substring(8);
    var html = `<a href="${recordUrl}" target="_blank">${name}</a>: <a href="${mapUrl}" target="_blank">${place}</a>`;
    return html;
}

function getUrlWithoutSearch(url) {
    return url.href.replace(url.search, '');
}

function appendHistory(message) {
    message = message.replace(/(\r|\n)/g, '<br/>');
    history.innerHTML = `${message}<div class="clear"/><br/>${history.innerHTML}`;
}

function getFullHtml(value) {
    return `<div contenteditable="true">${value}</div>`;
}

function getKeyHtml(key) {
    return `<div class="history_key">${key}</div>`
}

function getValueHtml(value) {
    return `<div contenteditable="true" class="history_value">${value}</div>`;
}
