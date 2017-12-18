import Axios from '../axios'

let _axios = new Axios()

//获取部门树
export const getOrgTree = (params, show, type) => {
    return _axios.get('org/orgTree', params, show, type).then(res => res.data)
}

//获取部门树(带用户)
export const getOrgTreeWithUsers = (params, show, type) => {
    return _axios.get('org/orgTreeWithUsers', params, show, type).then(res => res.data)
}

//添加部门
export const orgAdd = (params, show, type) => {
    return _axios.post('org/add', params, show, type)
}

//修改部门
export const orgEdit = (params, show, type) => {
    return _axios.post('org/edit', params, show, type)
}

//删除部门
export const orgDelete = (params, show, type) => {
    return _axios.post('org/delete', params, show, type)
}

//移动部门
export const orgMove = (params, show, type) => {
    return _axios.post('org/move', params, show, type)
}

//部门下子部门重新排序
export const reIndex = (params, show, type) => {
    return _axios.post('org/reIndex', params, show, type)
}

//添加帐号
export const staffAdd = (params, show, type) => {
    return _axios.post('staff/add', params, show, type)
}

//修改帐号
export const staffEdit = (params, show, type) => {
    return _axios.post('staff/edit', params, show, type)
}

//删除帐号
export const staffDelete = (params, show, type) => {
    return _axios.post('staff/delete', params, show, type)
}

//批量删除帐号
export const staffBatchDelete = (params, show, type) => {
    return _axios.post('staff/batchDelete', params, show, type)
}

//重置员工密码
export const staffResetPassword = (params, show, type) => {
    return _axios.post('staff/resetPassword', params, show, type)
}

//重置员工pin
export const staffResetPin = (params, show, type) => {
    return _axios.post('staff/resetPin', params, show, type)
}

//用户详情
export const getStaff = (params, show, type) => {
    return _axios.get('staff/getDetail', params, show, type).then(res => res.data)
}

//用户分页查询
export const getPagedList = (params, show, type) => {
    return _axios.post('staff/getPagedList', params, show, type)
}

//发送邮件
export const sendAccountInfoMail = (params, show, type) => {
    return _axios.post('staff/sendAccountInfoMail', params, show, type)
}

//发送邮件
export const batchSendAccountInfoMail = (params, show, type) => {
    return _axios.post('staff/batchSendAccountInfoMail', params, show, type)
}
//发送邮件
export const sendAllAccountInfoMail = (params, show, type) => {
    return _axios.post('staff/sendAllAccountInfoMail', params, show, type)
}
