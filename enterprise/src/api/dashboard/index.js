import Axios from '../axios'

let _axios = new Axios()

//企业快要过期的订单
export const getOrderList = (params, show, type) => {
    return _axios.get('order/findExpiringOrders', params, show, type).then(res => res.data)
};

// 概况统计
export const getGeneralView = (params, show, type) => {
    return _axios.get('overview/getGeneralView', params, show, type).then(res => res.data)
};

//当前会议概况
export const getConferenceAmount = (params, show, type) => {
    return _axios.get('overview/getConferenceAmount', params, show, type).then(res => res.data)
};

//当前会议室概况
export const getRoomAmount = (params, show, type) => {
    return _axios.get('overview/getRoomAmount', params, show, type).then(res => res.data)
};

//企业当前最新订单
export const getOrderNow = (params, show, type) => {
    return _axios.get('order/findLatestOrder', params, show, type).then(res => res.data)
};