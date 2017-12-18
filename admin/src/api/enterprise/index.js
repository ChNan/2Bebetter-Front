import Axios from '../axios'

let _axios = new Axios()

export const getCountryList = (params, show, type) => {
    return _axios.get('/country/getList', params, show, type);
}

export const getEnterpriseList = (params, show, type) => {
    return _axios.post('/enterprise/getPagedList', params, show, type);
}

export const enterpriseRegister = (params, show, type) => {
    return _axios.post('/enterprise/apply', params, show, type);
}

export const getEnterprise = (params, show, type) => {
    return _axios.get('/enterprise/get', params, show, type);
}

export const editEnterprise = (params, show, type) => {
    return _axios.post('/enterprise/edit', params, show, type);
}

export const resetPassword = (params, show, type) => {
    return _axios.post('/managerAccount/resetPassword', params, show, type);
}
//获取指定企业云端VMR，终端VMR及云会议端口当前可用的数量
export const getAllowSet = (params, show, type) => {
    return _axios.get('/order/getMergeView', params, show, type);
}

export const getSuitType = (params, show, type) => {
    return _axios.get('/order/findLatestOrder', params, show, type);
}
//企业高级功能参数设置查询
export const getConfig = (params, show, type) => {
    return _axios.get('/talkConfig/get', params, show, type);
}
//企业高级功能参数设置
export const setConfig = (params, show, type) => {
    return _axios.post('/talkConfig/edit', params, show, type);
}
//获取当前会议
export const getCountConference = (params, show, type) => {
    return _axios.get('/overview/countConference', params, show, type);
}
//在线用户数量统计
export const getcountOnlineStaff = (params, show, type) => {
    return _axios.get('/overview/countOnlineStaff', params, show, type);
}

export const getroom = (params, show, type) => {
    return _axios.get('/room/count', params, show, type);
}
export const getvmr = (params, show, type) => {
    return _axios.get('/vmr/count', params, show, type);
}
export const getstaff = (params, show, type) => {
    return _axios.get('/staff/count', params, show, type);
}
//会议室总数/room/count 云会场总数/vmr/count 用户总数/staff/count
export const getAllCounts = (params, show, type) => {
    return _axios.get('/overview/getGeneralView', params, show, type)
}
