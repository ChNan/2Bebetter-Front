import {
    t
} from '@/i18n/index'
import store from '@/vuex/'
import auth from '@/services/authService'
import {
    Loading
} from 'yl-element';
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
    axios.defaults.baseURL = '/admin/';
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

    axios.defaults.transformRequest = [data => {
        if (data instanceof Object) data = JSON.stringify(data);
        return data;
    }];
    axios.interceptors.request.use(config => {
        show()
        return config;
    }, error => {
        hide()
          Vue.prototype.$message({
              showClose: true,
              message: '请求失败！',
              type: 'error',
              onClose: () => {
                  //errorDispose(error.response.status, error.response.statusText)
              }
          });

        return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
        hide()
        if (response.data.ret < 0) {
            let error = response.data.error;
            let _msg = error.msg;
            let code = error.errorCode;
            if (error.fieldErrors && error.fieldErrors[0]) {
                _msg = error.fieldErrors[0].msg;
            }
            if (_msg != "" && _msg != null) {
                //* @alarmType 提示类型 1.warning(默认)   2. alert  3.success  4.info  6.error 7.''
                let _alarmType = store.state.common.axios.alarmType
                switch (_alarmType) {
                    case '':
                        break;
                    case 'alert':
                        errorAlert(_alarmType, t(_msg))
                        break;
                    default:
                        errorMessage(_alarmType, t(_msg), error.errorCode)
                        break;
                }
                errorDispose(code);
            }
        }
        auth.updateTimeout();
        return response;
    }, error => {
        hide();
        errorMsg(500);
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
const errorMsg = (code) =>{
    let msg ='';
    if (code) {
        switch (code) {
            case 504: msg = '网关超时';break;
            default: msg = t('common.net.error');break;
        }
        Vue.prototype.$message({
            showClose: true,
            message: msg,
            type: 'error',
            onClose: () => {
                //errorDispose(error.response.status, error.response.statusText)
            }
        });
    }

}
/*
 * 显示message
 * */
const errorMessage = (type, msg, code) => {
    Vue.prototype.$message({
        showClose: true,
        message: t(msg),
        type: type,
        onClose: () => {
            code = '401' && errorDispose(code)
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

        }
    });
}

/*
 * errorCode 处理
 * */
const errorDispose = (code) => {
    if (code == 401) {
        auth.logout();
        router.push('/admin/login')
    }
    if (code >= 500) {
        router.replace({
            path: '/error',
            query: {
                code: 500
            }
        })
    }
}

/**
 *  拼命加载...
 */
const show = () => {
    if (loading || !store.state.common.axios.showLoading) return
    loading = true;
    loadingInstance = Loading.service({
        fullscreen: false,
        text: t('common.loading')
    })
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
