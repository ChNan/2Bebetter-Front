

let getLength = (str) => {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

let cutStr = (str, len) => {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            // return s+"...";
            return s+"...";
        }
    }
    return s;
};



export {getLength, cutStr};


