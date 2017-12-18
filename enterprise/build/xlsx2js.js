var XLSX = require('xlsx')
var fs = require("fs")
var glob = require('glob')

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

Excel2js()

// Excel2js
function Excel2js() {
    var workbook = XLSX.readFile(path.join(rootPath, '/lang.xlsx'));
    to_json(workbook)
    function to_json(workbook) {

        // 获取 Excel 中所有表名
        var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
        sheetNames.forEach((sheetName) => {
            var _result = {};
            worksheet = workbook.Sheets[sheetName];
            _result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
            Object.keys(_result).forEach(k => {
                Object.keys(_result[k][0]).filter(function (item) {
                    return item != 'key'; //除去key值
                }).forEach(function (lang) {
                    var result = {};
                    _result[k].forEach(k => {
                        result[k.key] = k[lang]
                    })
                    fs.mkdir(path.join(rootPath, `/src/i18n/lang/${lang}/`), (err) => {
                       
                    }) //建目录
                    fs.open(path.join(rootPath, `/src/i18n/lang/${lang}/${sheetName}.js`), "w", function (err, fd) {
                        var buf = new Buffer("module.exports = i18n  = " + JSON.stringify(result));
                        fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
                        console.log('============成功生成' + path.join(rootPath, `/src/i18n/lang/${lang}/${sheetName}.js`) + '文件============')
                    })
                })

            })

        })
    }
}

