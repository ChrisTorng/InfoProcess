function decodeQP() {
    var input = document.getElementById('input').value;
    var output = decodeQuotedPrintable(input);
    document.getElementById('output').textContent = output;
}

function decodeQuotedPrintable(str) {
    // 首先移除軟斷行符號，即將 `=` 接續換行符的部分替換為空白
    var cleanedStr = str.replace(/=\r?\n/g, '');

    // 將剩餘的 =XX 替換為對應的 ASCII 字元
    var regex = /=([a-fA-F0-9]{2})/g;
    var decoded = cleanedStr.replace(regex, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    });
    return decoded;
}

function copyToClipboard() {
    var text = document.getElementById('output').textContent;
    navigator.clipboard.writeText(text).then(function() {
        alert('內容已複製到剪貼簿！');
    }, function(err) {
        alert('複製失敗：', err);
    });
}

function saveToFile() {
    var text = document.getElementById('output').textContent;
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'decoded-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}