import { t } from '@/i18n/index'
import auth from '@/services/authService'
import store from '@/vuex/'
import { Loading } from 'yl-element';
import router from '../router'

let Vue;
//保证只显示一次，判断loading&&state.asiox.showLoading
let loading = false;
let loadingInstance = null;

/*
 * 初始化配置
 * */
const plugin = _Vue => {
    Vue = _Vue;
    if (plugin.installed) {
        return;
    }
    plugin.installed = true;
    axios.defaults.baseURL = '/meeting';
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

    axios.defaults.transformRequest = [data => {
        if (data instanceof Object) data = JSON.stringify(data);
        return data;
    }];
    axios.interceptors.request.use(config => {
        show();
        return config;
    }, error => {
        hide();
        errorDispose(504);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
        hide();
        if (response.data.ret < 0) {
            let error = response.data.error;
            let _msg = error.msg;
            if (error.fieldErrors && error.fieldErrors[0]) {
                _msg = error.fieldErrors[0].msg;
            }
            if (_msg !== "" && _msg !== null) {
                //* @alarmType 提示类型 1.warning(默认)   2. alert  3.success  4.info  6.error 7.''
                let _alarmType = store.state.common.axios.alarmType;
                switch (_alarmType) {
                    case '':
                        if (error.errorCode == 401){
                            auth.logout();
                            router.replace({ path: '/meeting/login', query: { code: 401,msg: 'expired' } });
                        }
                        if (error.errorCode == 403){
                            errorDispose(403);
                        }
                        break;
                    case 'alert':
                        errorAlert(_alarmType, t(_msg), error.errorCode);
                        break;
                    default:
                        errorMessage(_alarmType, t(_msg), error.errorCode);
                        break;
                }
            }
        }
        auth.updateTimeout();
        return response;
    }, error => {
        hide();
        errorMessage('error', t(error.response && error.response.statusText));
        return Promise.reject(error);
    });

    Object.defineProperties(Vue.prototype, {
        $http: {
            get: function get() {
                return axios;
            }
        }
    });
    Vue.http = axios;
}

/*
 * 显示message
 * */
const errorMessage = (type, msg, code) => {
    code == '401' && errorDispose(code);
    code == '403' && errorDispose(code);
    Vue.prototype.$message({
        showClose: true,
        message: t(msg)|| 'Internal Server Error',
        type: type,
        onClose: () => {

        }
    });
}

/*
 * 显示确定提示框
 * */
const errorAlert = (msg, code) => {
    Vue.prototype.$alert(t(msg), '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
            code == '401' && errorDispose(code);
        }
    });
}

/*
 * errorCode 处理
 * */
const errorDispose = (code) => {
    if (router.currentRoute&&router.currentRoute.matched&&router.currentRoute.matched.some(record => record.meta.requiresAuth)) return;
    if (code == 401) {
        auth.logout();
        router.replace({ path: '/meeting/login', query: { code: 401 ,msg: 'expired' } });
    }
    else {
        router.replace({ path: '/meeting/error', query: { code: code } });
    }
}

/**
 *  拼命加载...
 */
const show = () => {
    if (loading || !store.state.common.axios.showLoading) return;
    loading = true;
    loadingInstance = Loading.service({ fullscreen: false, text: t('common.loading') })
}

/**
 *  隐藏拼命加载...
 */
const hide = () => {
    if (!loading) return;
    if (loadingInstance) {
        loadingInstance.close();
        loadingInstance = null
    }
    loading = false;
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin
