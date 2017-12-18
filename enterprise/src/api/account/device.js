import Axios from '../axios'

let _axios = new Axios()

//查询详情
export const getDevice = params => {
    return _axios.get('device/get', params).then(res => res.data)
}

//查询分页列表
export const getPagedList = (params, show, type) => {
    return _axios.post('device/getPagedList', params, show, type)
}

//新增视频设备
export const addDevice = params => {
    return _axios.post('device/add', params)
}

//重置密码
export const resetPassword = (params, show, type) => {
    return _axios.post('device/resetPassword', params, show, type)
}

//重置pin码
export const resetPin = (params, show, type) => {
    return _axios.post('device/resetPin', params, show, type)
}

//编辑视频设备
export const editDevice = (params, show, type) => {
    return _axios.post('device/edit', params, show, type)
}

//删除视频设备
export const deleteDevice = (params, show, type) => {
    return _axios.post('device/delete', params, show, type)
}

//发送邮件
export const sendMail = (params, show, type) => {
    return _axios.post('device/sendMail', params, show, type)
}
