var XLSX = require('xlsx')
var fs = require("fs")
var glob = require('glob')

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

js2Excel()

//js2Excel
function js2Excel() {
    var p = [];
    glob.sync(path.join(rootPath, '/src/i18n/lang/zh/*.js')).forEach((n) => {
        var _file = n.slice(n.lastIndexOf('/') + 1, n.lastIndexOf('.')); //文件名
        p.push(_file)
        // console.log(p)
    })

    var i18s = glob.sync(path.join(rootPath, '/src/i18n/lang/**/*.js'));

    var lang = {};

    p.forEach((file) => {
        var _lang = [];
        i18s.forEach(function (i18, i) {
            var f = i18.slice(i18.lastIndexOf('/') + 1, i18.lastIndexOf('.'))
            if (f == file) {
                _lang = _lang.concat(expVal(i18))
            }
        });
        lang[file] = _lang;
    })
    ouput(lang)

    function expVal(i18) {
        var json = require(i18);
        var arr = [];
        Object.keys(json).forEach(((w) => {
            var file = i18.split('/')[i18.split('/').length - 2];
            var _worksheet = {};
            _worksheet.key = w;
            _worksheet[file] = json[w]
            arr.push(_worksheet)
        }))
        return arr;
    }

    function ouput(lang) {
        var worksheet = {};
        Object.keys(lang).forEach((l, i) => {
            var a = [];
            var _a = [];
            lang[l].forEach((c) => {
                lang[l].forEach((e) => {
                    if (c.key === e.key) {
                        c = Object.assign({}, c, e)
                    }
                })
                a.push(c)
            })
            a.forEach((x) => {
                var r = false;
                _a.forEach((y) => {
                    if( x.key == y.key) {
                        r = true;
                    }
                })
                if(!r) {
                    _a.push(x);
                }
            })
            var sheets = XLSX.utils.json_to_sheet(_a);
            worksheet[l] = sheets;
        })

        // console.log(worksheet)
        var workbook = {
            SheetNames: p,
            Sheets: Object.assign({}, worksheet)
        }
        // console.log(workbook)
        XLSX.writeFile(workbook, path.join(rootPath, '/lang.xlsx'))
        console.log(`========成功生成lang.xlsx文件 包含${p}共${p.length}个表========`)
    }

}

