function textChanged(inputId, buttonId) {
    inputId = "#" + inputId;
    buttonId = "#" + buttonId;
    if ($(inputId).val().trim() === "") {
        $(buttonId).addClass("disabled");
    } else {
        $(buttonId).removeClass("disabled");
    }
}

function fixLineBreaks(string) {
    var replaceWith = '\r\n';

    if (string.indexOf('\r\n') > -1) {  	// Windows encodes returns as \r\n
        // Good nothing to do
    } else if (string.indexOf('\n') > -1) { 	// Unix encodes returns as \n
        string = replaceAll(string, '\n', replaceWith);
    } else if (string.indexOf('\r') > -1) { 	// Macintosh encodes returns as \r
        string = replaceAll(string, '\r', replaceWith);
    }
    return string;
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(find, 'g'), replace);
}