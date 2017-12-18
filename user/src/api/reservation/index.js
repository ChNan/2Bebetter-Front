import Axios from '../axios'


let axios = new Axios();

/*
 * post示例
 *
 * @params（可选）需要传的参数，对象
 * @show （可选） 是否显示正在加载
 * @type （可选） 当ret小于0时候的处理  提示类型 1.warning(默认) 2. alert  3.success  4.info  6.error  7.''（不显示）
 *
 * */
// 获取会议室列表
export const reqMeetingRoomList = (params, show=false, type="") => {
    return axios.post('resource/occupancy/room', params, show, type)
};

//获取时区

export const reqTimezoneList = (params, show=false, type="") => {
    return axios.get('winTimeZone/getList', params, show, type)
};
//获取组织树

export const reqOrgTree = (params, show=false, type="") => {
    return axios.get('roomCategory/categoryTree', params, show, type)
};
//获取人员

export const reqPersonList = (params, show=false, type="") => {
    return axios.get('org/orgTreeWithUsers', params, show, type)
};

//检查夏令时

export const reqCheckTimezone = (params, show=false, type="") =>{
    return axios.post("winTimeZone/dst/check",params, show, type)
};

//预约会议室

export const reqReservationMeeting = (params, show=true, type="") =>{
    return axios.post("conferencePlan/add",params, show, type)
};

//获取默认时区

export const reqDefaultTimezone = (params, show=false, type="") =>{
    return axios.post("timeConfig/get",params, show, type)
};

//查询通话设置是否有观众

export const reqhasViewer = (params, show=false, type="") =>{
    return axios.get("talkConfig/get",params, show, type)
};

//获取vmr资源占用情况

export const reqVmr = (params, show=false, type="") =>{
    return axios.post("resource/occupancy/vmr",params, show, type)
};

//会议室冲突校验

export const reqConflictCheck = (params, show=false, type="") =>{
    return axios.post("resource/hasConflict/room",params, show, type)
};

//获取公有云资源列表

export const reqPublicResource = (params, show=false, type="") =>{
    return axios.post("vmr/getEnableList",params, show, type)
};

//vmr冲突验证

export const checkVmrConflict = (params, show=false, type="") =>{
    return axios.post("resource/hasConflict/vmr",params, show, type)
};

// 获取会议详情 by recordId
export const reqMeetingDetail = (params, show=false, type="") =>{
    return axios.get("conferenceRecord/"+params,null, show, type).then(res => res.data)
};

// 获取周期会议详情 by planId

export const reqMeetingPlanDetail = (params, show=false, type="") =>{
    return axios.get("conferencePlan/"+params,null, show, type).then(res => res.data)
};

//编辑系列会议预约

export const reqEditPlanMeeting = (params, show=false, type="") =>{
    return axios.post("conferencePlan/edit",params, show, type)
};

//编辑单次会议预约
export const reqEditOnceMeeting = (params, show=false, type="") =>{
    return axios.post("conferenceRecord/edit",params, show, type)
};

//请求业务模式状态
export const reqBussinessMode = (params, show = false, type = "") => {
    return axios.get("order/findInServiceOrders", params, show, type).then(res=>res.data)
};
