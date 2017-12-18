/*
 * ==========公用Js工具==========
 * */
export const isIE9 = () => {
    let agent = window.navigator.userAgent.toLowerCase();
    let ismis = agent.match(/msie ([\d.]+)/);
    let ver;
    if (ismis) {
        ver = agent.match(/msie ([\d.]+)/)[1] || 0;
    }
    return ver == '9.0';
}
export const capsLock = (e, formname)=>{
    if (isIE9()) {
        if(typeof formname == 'object'){
            if(typeof formname[e.target.name] !='undefined')
                formname[e.target.name] = e.target.value;
        }
        if(typeof formname == 'string')
        formname = e.target.value;
    }
    return formname;
}
// 获取url参数
export const GetRequest = () => {
    let url = location.search;
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
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

//空对象设置为null
export const setNull =(data)=>{
    for (let prop in data) {
        if (typeof data[prop] == 'object') {
            setNull(data[prop]);
        } else {
            if (data[prop] === "") {
                data[prop] = null;
            }else if(typeof data[prop] === 'string'){
                    data[prop] = data[prop].trim();
            }
        }
    }
    return data;
}