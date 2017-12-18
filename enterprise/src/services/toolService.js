/*
 * ==========公用Js工具==========
 * */

export const filterParams = source => {
    const result = source;
    for (let key in source) {
        result[key] = (source[key] !== null && source[key] !== undefined && typeof source[key] === 'object') ? filterParams(source[key]) : (source[key] === '' ? null : source[key]);
    }
    return result;
}


/* 对象对比 */
export const equals = (x, y) => {
    var in1 = x instanceof Object;
    var in2 = y instanceof Object;
    if (!in1 || !in2) {
        return x === y;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
    }
    for (var p in x) {
        var a = x[p] instanceof Object;
        var b = y[p] instanceof Object;
        if (a && b) {
            return equals(x[p], y[p]);
        } else if (x[p] !== y[p]) {
            return false;
        }
    }

    return true;
}

/* 深度复制 */
export const defaultsDeep = source => {
    const result = {};
    for (let key in source) {
        result[key] = typeof source[key] === 'object' ? defaultsDeep(source[key]) : source[key];
    }
    return result;
}

export const isIE9 = () => {
    let agent = window.navigator.userAgent.toLowerCase();
    let ismis = agent.match(/msie ([\d.]+)/);
    let ver;
    if (ismis) {
        ver = agent.match(/msie ([\d.]+)/)[1] || 0;
    }
    return ver == '9.0';
}

// 获取url参数
export const GetRequest = () => {
    let url = location.href;
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(url.indexOf("?")+1);
        if (str.indexOf("&") != -1) {
            var strs = str.split("&");
        } else {
            var strs = [];
            strs.push(str)
        }
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// 获取后台返回错误
export const GetErr = (response) => {
    let error = response.error;
    let _msg = error.msg
    if (error.fieldErrors && error.fieldErrors[0]) {
        _msg = error.fieldErrors[0].msg;
    }
    return _msg;
}


//时间戳日期格式化
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

export default new Date()