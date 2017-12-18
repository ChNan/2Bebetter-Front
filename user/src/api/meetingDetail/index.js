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


//获取会议详情
export const reqMeetingDetail = (params, show=false, type="") =>{
    return axios.get("conferenceRecord/"+params,null, show, type).then(res => res.data.data)
};

//删除单次会议
export const deletOnceMeeting = (params, show=false, type="") =>{
    return axios.post("conferenceRecord/delete",params, show, type)
};

//删除系列会议
export const deletePlanMeeting = (params, show=false, type="") =>{
    return axios.post("conferencePlan/delete",params, show, type)
};
