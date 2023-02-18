const history = document.getElementById('history');
const sourceElement = document.getElementById('source');

document.getElementById('list').onclick = async () => {
    list(await getSourceOrClipboard());
};
document.getElementById('table').onclick = async () => {
    table(await getSourceOrClipboard());
};

async function getSourceOrClipboard() {
    if (sourceElement.value) {
        return sourceElement.value;
    }

    return await navigator.clipboard.readText();
}

function table(source) {
    clearHistory();
    source = truncateOthers(source);
    var records = source.split('\n\n');
    for (var record in records) {
        appendHistory(getTruncatedForChatRecord(records[record]));
    }
}

function getTruncatedForChatRecord(record) {
    var arr = record.split('\n');
    var removed = arr.splice(3, 2);
    var result = arr.join('\n');
    return result;
}

function list(source) {
    clearHistory();
    source = truncateOthers(source);
    var records = source.split('\n\n');
    for (var record in records) {
        appendHistory(getRecord(records[record]));
    }
}

function truncateOthers(source) {
    source = source.substring(source.indexOf('please-bird-mindfully') + 'please-bird-mindfully'.length + 2);
    source = source.substring(0, source.indexOf('***********') - 2);
    source = source.replace(/\r\n/, ''); // remove beginning newline when get from clipboard
    source = source.replace(/\r\n/g, '\n');
    return source;
}

function getRecord(record) {
    console.log(record);
    var lines = record.split('\n');
    var count = lines[0].substring(lines[0].lastIndexOf('(') + 1, lines[0].lastIndexOf(')'));
    var fullName = lines[0].substring(0, lines[0].lastIndexOf('('));
    var name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    if (!+count) {
        count = 'X';
        fullName = lines[0];
        name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    }

    var timeWithAuthor = lines[1].substring(lines[1].indexOf(':') - 2).split(' by ');
    var time = timeWithAuthor[0].replace(/^0+/g, '');;
    var author = timeWithAuthor[1];
    var fullPlace = lines[2].substring(2);
    var place = fullPlace.replace(/\([a-z\- ]*\)/i, ''); // remove (English place)
    place = place.replace(/\(\d+.\d+, \d+.\d+\)/, ''); // remove position (25.033, 121.525)
    place = place.replace(/[ ,a-z]+$/i, ''); // remove trailing alphabets
    place = place.replace(/\([ ,\.\-a-z]+\)/i, ''); // remove middle (alphabets)
    place = place.replace(/[ ,\-]*/g, ''); // remove - and spaces
    place = place.replace(/^[a-z]*/i, ''); // remove beginning "Auto selected"/TW...    
    var mapUrl = lines[3].substring(6);
    var recordUrl = lines[4].substring(8);

    var media = lines[5] && lines[5].indexOf('- 媒體: ') === 0 ? lines[5].substring(6, lines[5].length) : '';
    media = media.replace('Photo', '張');
    var commentLine = media ? 6 : 5;
    var comment = lines[commentLine] && lines[commentLine].indexOf('- 備註: "') === 0 ? lines[commentLine].substring(7, lines[commentLine].length - 1) : '';
    var commentWithBr = comment ? `<br/>${comment}` : '';

    var html = `${count} <span title="${fullName}">${name}</span> ${media} <a href="${recordUrl}" target="_blank">${time}</a> ${author}<br/>` +
        `<a href="${mapUrl}" target="_blank" title="${fullPlace}">${place}</a>${commentWithBr}`;
    return html;
}

function getUrlWithoutSearch(url) {
    return url.href.replace(url.search, '');
}

function clearHistory() {
    history.innerHTML = '';
}

function appendHistory(message) {
    message = message.replace(/(\r|\n)/g, '<br/>');
    history.innerHTML = `${history.innerHTML}<div class="clear"/><br/>${message}`;
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
