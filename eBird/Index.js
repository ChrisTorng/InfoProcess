const history = document.getElementById('history');
const sourceElement = document.getElementById('source');

quickSummary(sourceElement.value);

function quickSummary(source) {
    source = source.substring(source.indexOf('please-bird-mindfully') + 'please-bird-mindfully'.length + 2);
    source = source.substring(0, source.indexOf('***********') - 2);
    var records = source.split('\n\n');
    for (var record in records) {
        appendHistory(getRecord(records[record]));
    }
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

    var timeWithAuthor = lines[1].substring(lines[1].indexOf(':') - 2);
    var fullPlace = lines[2].substring(2);
    var place = fullPlace.lastIndexOf('(') > 0 ? fullPlace.substring(0, fullPlace.lastIndexOf('(')) : fullPlace;
    var mapUrl = lines[3].substring(6);
    var recordUrl = lines[4].substring(8);
    var media = lines[5] && lines[5].indexOf('- 媒體: ') === 0 ? lines[5].substring(6, lines[5].length) : '';
    var commentLine = media ? 6 : 5;
    var comment = lines[commentLine] && lines[commentLine].indexOf('- 備註: "') === 0 ? lines[commentLine].substring(7, lines[commentLine].length - 1) : '';
    var html = `<a href="${recordUrl}" target="_blank">${count}</a>: ${name} ${timeWithAuthor} <a href="${mapUrl}" target="_blank">${place}</a> ${media} ${comment}`;
    return html;
}

function getUrlWithoutSearch(url) {
    return url.href.replace(url.search, '');
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
