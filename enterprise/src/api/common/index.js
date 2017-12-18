import Axios from '../axios'

let _axios = new Axios()

//企业快要过期的订单
export const getOrderList = (params, show, type) => {
    return _axios.get('order/findExpiringOrders', params, show, type).then(res => res.data)
};

//获得当前企业的基本信息
export const getCurrentEnterprise = (params, show, type) => {
    return _axios.get('enterprise/getCurrentEnterprise', params, show, type).then(res => res.data)
};

//编辑企业联系信息
export const editContactInfo = (params, show, type) => {
    return _axios.post('enterprise/editContactInfo', params, show, type)
};

//修改密码
export const changePassword = (params, show, type) => {
    return _axios.post('account/changePassword', params, show, type)
};