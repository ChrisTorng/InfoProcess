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
    var recordsText = source.split('\n\n');
    outputTable();
    for (let recordText of recordsText) {
        addTableRow(getRecord(recordText));
    }
}

// function getTruncatedForChatRecord(record) {
//     var arr = record.split('\n');
//     var removed = arr.splice(3, 2);
//     var result = arr.join('\n');
//     return result;
// }

function list(source) {
    clearHistory();
    source = truncateOthers(source);
    var recordsText = source.split('\n\n');
    for (let recordText of recordsText) {
        appendHistory(getListHtml(getRecord(recordText)));
    }
}

function truncateOthers(source) {
    source = source.substring(source.indexOf('please-bird-mindfully') + 'please-bird-mindfully'.length + 2);
    source = source.substring(0, source.indexOf('***********') - 2);
    source = source.replace(/\r\n/, ''); // remove beginning newline when get from clipboard
    source = source.replace(/\r\n/g, '\n');
    return source;
}

function getRecord(recordText) {
    console.log(recordText);
    var lines = recordText.split('\n');
    var count = lines[0].substring(lines[0].lastIndexOf('(') + 1, lines[0].lastIndexOf(')'));
    var fullName = lines[0].substring(0, lines[0].lastIndexOf('('));
    var name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    if (!+count) {
        count = 'X';
        fullName = lines[0];
        name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    }

    var timeWithReporter = lines[1].substring(lines[1].indexOf(':') - 2).split(' by ');
    var time = timeWithReporter[0].replace(/^0+/g, '');;
    var reporter = timeWithReporter[1];
    var fullPlace = lines[2].substring(2);
    var place = fullPlace.replace(/\([a-z\- ]*\)/i, ''); // remove (English place)
    place = place.replace(/\(\d+.\d+, \d+.\d+\)/, ''); // remove position (25.033, 121.525)
    place = place.replace(/[ ,'a-z]+$/i, ''); // remove trailing alphabets
    place = place.replace(/\([\(\) ,\.\-\&'\da-z]+\)/i, ''); // remove middle (alphabets)
    place = place.replace(/[ ,\-]*/g, ''); // remove - , and spaces
    place = place.replace(/^[a-z]*/i, ''); // remove beginning "Auto selected"/TW...    
    var mapUrl = lines[3].substring(6);
    var recordUrl = lines[4].substring(8);

    var media = lines[5] && lines[5].indexOf('- 媒體: ') === 0 ? lines[5].substring(6, lines[5].length) : '';
    media = media.substring(0, media.indexOf(' '));
    var commentLine = media ? 6 : 5;
    var comment = lines[commentLine] && lines[commentLine].indexOf('- 備註: "') === 0 ? lines[commentLine].substring(7, lines[commentLine].length - 1) : '';

    return {
        count,
        fullName,
        name,
        time,
        reporter,
        fullPlace,
        place,
        mapUrl,
        recordUrl,
        media,
        comment
    };
}

function getListHtml(record) {
    var commentWithBr = record.comment ? `<br/>${record.comment}` : '';
    var media = record.media ? record.media + ' 張' : '';
    return `<p>${record.count} <span title="${record.fullName}">${record.name}</span> ${media} 
<a href="${record.recordUrl}" target="_blank">${record.time}</a> ${record.reporter}<br/>
<a href="${record.mapUrl}" target="_blank" title="${record.fullPlace}">${record.place}</a>
${commentWithBr}</p>`;
}

function outputTable() {
    appendHistory(`<table id="birdsTable">
    <thead>
        <tr>
            <th>數量</th>
            <th title="原始鳥種完整名稱">鳥種</th>
            <th>照片</th>
            <th>時間</th>
            <th>回報人</th>
            <th title="原始地點完整名稱">地點</th>
            <th>備註</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>`);
}

function addTableRow(record) {
    let birdsTable = document.getElementById('birdsTable');
    let row = birdsTable.insertRow(-1);
    row.innerHTML = `<tr>
    <td>${record.count}</td>
    <td title="${record.fullName}">${record.name}</td>
    <td>${record.media}</td>
    <td class="time"><a href="${record.recordUrl}" target="_blank">${record.time}</a></td>
    <td>${record.reporter}</td>
    <td><a href="${record.mapUrl}" target="_blank" title="${record.fullPlace}">${record.place}</a></td>
    <td>${record.comment}</td>
</tr>`;
}

function clearHistory() {
    history.innerHTML = '';
}

function appendHistory(message) {
    history.innerHTML = `${history.innerHTML}
${message}`;
}
