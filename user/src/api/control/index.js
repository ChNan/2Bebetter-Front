import  Axios from '../axios'

/*
 * 实例化Axios
 * */

let _axios = new Axios()
let _axios1 = new Axios(false, '/front/') //前端接口

/*
 * post示例
 *
 * @params（可选）需要传的参数，对象
 * @show （可选） 是否显示正在加载
 * @type （可选） 当ret小于0时候的处理  提示类型 1.warning(默认) 2. alert  3.success  4.info  6.error  7.''（不显示）
 *
 * */
export const GetList = (params, show, type) => {
    return _axios.get('/GetList', params, show, type).then(d=>d.data)
};
/**
 *请求邮箱模板
 */
export const getEmail = (params, show, type) => {
    return _axios.post('conferenceMail/getTemplate', params, show, type)
};
/**
 * 请求即时会议的邮箱模板
 */
export const getMeetNowEmailTemplate = (params, show, type) => {
    return _axios.post('conferenceMail/getTemplate/meetingnow', params, show, type)
};

/**
 *获取部门树(带用户)
 */
export const getTreeList = (params, show, type) => {
    return _axios.get('org/orgTreeWithUsers', params, show, type).then(d=>d.data)
};
/**
 *获取设备
 */
export const getTreeDeviceList = (params, show, type) => {
    return _axios.get('org/orgTreeWithDevices', params, show, type).then(d=>d.data)
};

/**
 * 发送邮箱
 */
export const sendEmail = (params, show, type) => {
    return _axios.post('conferenceMail/send/async', params, show, type)
};


// 密码获取
export const getPsw = (params, show, type) => {
    return _axios1.get('getPsw', params, show, type).then(res => res.data)
};

//删除单次会议
export const deletOnceMeeting = (params, show, type) =>{
    return _axios.post("conferenceRecord/delete",params, show, type)
};

//删除系列会议
export const deletePlanMeeting = (params, show, type) =>{
    return _axios.post("conferencePlan/delete",params, show, type)
};

//判断会议是否是周期会议
export const reqCheckRecurrence = (params, show, type) =>{
    return _axios.get("conferenceRecord/checkRecurrence/"+params,null, show, type).then(res => res.data.data)
};

// 会控页面保活
export const touch = (params, show, type) =>{
    return _axios.get("token/touch",params, show, type).then(res => res.data)
};

// 通话设置查询
export const talkConfig = (params, show, type) =>{
    return _axios.get("talkConfig/get",params, show, type).then(res => res.data)
};
