import Axios from '../axios'

/*
 * 实例化Axios
 * */
let _axios = new Axios()
let _axios1 = new Axios(false, '/front/') //前端接口

/*
 * post示例
 *
 * @params（可选）需要传的参数，对象
 * @show （可选） 是否显示正在加载
 * @type （可选） 当ret小于0时候的处理  提示类型 1.warning(默认) 2. alert  3.success  4.info  6.error  7.''（不显示）
 *
 * */

// 首页3个会议的获取
export const changePassword = (params, show, type) => {
    return _axios.post('staff/changePassword', params, show, type)
};

// 获取正在进行的会议数
export const changeEmail = (params, show, type) => {
    return _axios.post("staff/edit", params, show, type).then(res => res.data)
};
