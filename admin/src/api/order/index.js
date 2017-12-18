import Axios from '../axios'

let _axios = new Axios()

export const addOrder = (params, show, type) => {
    return _axios.post('/order/add', params, show, type);
}

export const terminateOrder = (params, show, type) => {
    return _axios.post('/order/terminateOrder', params, show, type);
}

export const fuzzyMatchName = (params, show, type) => {
    return _axios.get('/enterprise/fuzzyMatch', params, show, type);

}

export const matchEnterprise = (params, show, type) => {
    return _axios.get('/enterprise/matchEnterprise', params, show, type);
}

export const getOrderList = (params, show, type) => {
    return _axios.post('/order/getPagedList', params, show, type);

}

export const getSales = (params, show, type) => {
    return _axios.get('/order/salesVolume', params, show, type);
}

export const getOrderDetail = (params, show, type) => {
    return _axios.get('/order/get', params, show, type);
}
//获取指定企业最新的订单
export const getLatestOrder = (params, show, type) => {
    return _axios.get('/order/findLatestOrder', params, show, type)
}
export const getTimezone = (params, show, type) => {
    return _axios.get('/timeConfig/getByNumber', params, show, type)
}


