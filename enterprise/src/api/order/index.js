import Axios from '../axios'

let _axios = new Axios()

// 获取订单
export const getPagedList = (params, show, type) => {
    return _axios.post('order/getPagedList', params, show, type)
}

// 获取当前服务详情
export const getMergeView = (params, show, type) => {
    return _axios.get('order/getMergeView', params, show, type).then(res => res.data)
};

// 获取订单项目叠加
export const getItemList = (params, show, type) => {
    return _axios.get('order/getItemList', params, show, type).then(res => res.data)
};
