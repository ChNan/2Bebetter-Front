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
// 登录
export const requestLogin = (params, show, type) => {
    return _axios1.post('login', params, show, type)
};
// 验证码获取
export const requestCaptcha = (params, show, type) => {
    return _axios1.get('captcha', params, show, type).then(res => res.data)
};
// 退出
export const requestLogout = (params, show, type) => {
    return _axios1.get('logout', params, show, type).then(res => res.data)
};
// 找回密码
export const requestForgetPsw = (params, show, type) => {
    return _axios1.post('forgetPassword', params, show, type)
};
