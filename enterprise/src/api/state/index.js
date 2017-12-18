import Axios from '../axios'

/*
 * 实例化Axios
 * */
let _axios = new Axios(false)

/*
 * post示例
 *
 * @params（可选）需要传的参数，对象
 * @show （可选） 是否显示正在加载
 * @type （可选） 当ret小于0时候的处理  提示类型 1.warning(默认) 2. alert  3.success  4.info  6.error  7.''（不显示）
 *
 * */
export const getUserPagedList = (params, show, type) => {
    return _axios.post('overview/getUserPagedList', params, show, type)
};

export const getConferencePagedList = (params, show, type) => {
    return _axios.post('overview/getConferencePagedList', params, show, type)
};

export const getServerTime = (params, show, type) => {
    return _axios.get('overview/getServerTime', params, show, type).then(res => res.data)
};