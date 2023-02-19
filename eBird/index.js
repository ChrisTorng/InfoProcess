const history = document.getElementById('history');
const sourceElement = document.getElementById('source');
let lastPlace;

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

// function getTruncatedForChatRecord(record) {
//     const arr = record.split('\n');
//     const removed = arr.splice(3, 2);
//     const result = arr.join('\n');
//     return result;
// }

function list(source) {
    clearHistory();
    const records = getRecords(source);
    for (const record of records) {
        appendHistory(getListHtmlOrderByPlace(record));
    }
}

function table(source) {
    clearHistory();
    const records = getRecords(source);
    outputTable();
    for (const record of records) {
        addTableRow(record);
    }
}

function getRecords(source) {
    source = truncateOthers(source);
    const recordsText = source.split('\n\n');
    const records = [];
    for (const recordText of recordsText) {
        records.push(getRecord(recordText));
    }

    records.sort((record1, record2) => record1.place.localeCompare(record2.place));
    return records;
}

function truncateOthers(source) {
    source = source.substring(source.indexOf('please-bird-mindfully') + 'please-bird-mindfully'.length + 2)
    return source.substring(0, source.indexOf('***********') - 2)
        .replace(/\r\n/, '') // remove beginning newline when get from clipboard
        .replace(/\r\n/g, '\n');
}

function getRecord(recordText) {
    console.log(recordText);
    const lines = recordText.split('\n');
    let count = lines[0].substring(lines[0].lastIndexOf('(') + 1, lines[0].lastIndexOf(')'));
    let fullName = lines[0].substring(0, lines[0].lastIndexOf('('));
    let name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    if (!+count) {
        count = 'X';
        fullName = lines[0];
        name = fullName.substring(0, fullName.lastIndexOf('(') - 1);
    }

    const timeWithReporter = lines[1].substring(lines[1].indexOf(':') - 2).split(' by ');
    const time = timeWithReporter[0].replace(/^0+/g, '');;
    const reporter = timeWithReporter[1];
    const fullPlace = lines[2].substring(2);
    const place = fullPlace.replace(/\([a-z\- ]*\)/i, '') // remove (English place)
        .replace(/\(\d+.\d+, \d+.\d+\)/, '') // remove position (25.033, 121.525)
        .replace(/[ ,'a-z]+$/i, '') // remove trailing alphabets
        .replace(/\([\(\) ,\.\-\&'\da-z]+\)/i, '') // remove middle (alphabets)
        .replace(/[ ,\-]*/g, '') // remove - , and spaces
        .replace(/^[a-z]*/i, ''); // remove beginning "Auto selected"/TW...    
    const mapUrl = lines[3].substring(6);
    const recordUrl = lines[4].substring(8);

    let media = (lines[5] && lines[5].indexOf('- 媒體: ') === 0 ?
        lines[5].substring(6, lines[5].length) :
        '');
    media = media.substring(0, media.indexOf(' '));
    const commentLine = media ? 6 : 5;
    const comment = lines[commentLine] && lines[commentLine].indexOf('- 備註: "') === 0 ?
        lines[commentLine].substring(7, lines[commentLine].length - 1) :
        '';

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
    const commentWithBr = record.comment ? `<br/>${record.comment}` : '';
    const media = record.media ? record.media + ' 張' : '';
    return `<p>${record.count} <span title="${record.fullName}">${record.name}</span> ${media} 
<a href="${record.recordUrl}" target="_blank">${record.time}</a> ${record.reporter}<br/>
<a href="${record.mapUrl}" target="_blank" title="${record.fullPlace}">${record.place}</a>
${commentWithBr}</p>`;
}

function getListHtmlOrderByPlace(record) {
    let placeText = '';
    if (record.place !== lastPlace) {
        placeText = `<br/><a href="${record.mapUrl}" target="_blank" title="${record.fullPlace}">${record.place}</a><br/>`;
        lastPlace = record.place;
    }

    const media = record.media ? record.media + ' 張' : '';
    return `${placeText}${record.count} <span title="${record.fullName}">${record.name}</span> ${media} 
<a href="${record.recordUrl}" target="_blank">${record.time}</a> ${record.reporter} ${record.comment}<br/>`;
}

function outputTable() {
    appendHistory(`<table id="birdsTable">
    <thead>
        <tr>
            <th title="原始地點完整名稱">地點</th>
            <th>數量</th>
            <th title="原始鳥種完整名稱">鳥種</th>
            <th>照片</th>
            <th>時間</th>
            <th>回報人</th>
            <th>備註</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>`);
}

function addTableRow(record) {
    let placeText = '';
    let placeDivider = '';
    if (record.place !== lastPlace) {
        placeText = `<a href="${record.mapUrl}" target="_blank" title="${record.fullPlace}">${record.place}</a>`;
        placeDivider = 'placeDivider';
        lastPlace = record.place;
    }

    const birdsTable = document.getElementById('birdsTable');
    const row = birdsTable.insertRow(-1);
    row.innerHTML = `<tr>
    <td class="${placeDivider}">${placeText}</td>
    <td class="${placeDivider}">${record.count}</td>
    <td class="${placeDivider}" title="${record.fullName}">${record.name}</td>
    <td class="${placeDivider}">${record.media}</td>
    <td class="${placeDivider} time"><a href="${record.recordUrl}" target="_blank">${record.time}</a></td>
    <td class="${placeDivider}">${record.reporter}</td>
    <td class="${placeDivider}">${record.comment}</td>
</tr>`;
}

function clearHistory() {
    history.innerHTML = '';
    lastPlace = '';
}

function appendHistory(message) {
    history.innerHTML = `${history.innerHTML}
${message}`;
}
