import store from '@/vuex/'
import {UPDATE_AXIOS_ALARM_TYPE, UPDATE_AXIOS_LOADING, UPDATE_AXIOS_DEFAULT}  from '../vuex/mutation-types'

// import Mock from '../mock'

/*
 * ---Axios过滤类
 * @mock 是否开启mock
 * base 请求路径前缀
 * */
class Axios {

    /*
     * @base = 请求的接口前缀（String）
     * */
    constructor(mock, base = '/api/v1/manager/') {
        this.base = base;
       /* if (mock) {
            this.base = '';
            Mock.start();
        } else {
            this.base = base;
            Mock.restore();
        }*/
    }

    post(url, params, isLoading, alarmType) {
        this.storeCommit(isLoading, alarmType)
        return axios.post(this.base + url, params).then(res => {
            this.storeDefault()
            return res.data
        })
    }

    get(url, params, isLoading, alarmType) {
        this.storeCommit(isLoading, alarmType)
        return axios.get(this.base + url + '?t=' + new Date().getTime(), {params: params})
    }

    storeCommit(_isLoading = true, _alarmType = 'warning') {
        store.commit(UPDATE_AXIOS_LOADING, _isLoading)
        store.commit(UPDATE_AXIOS_ALARM_TYPE, _alarmType)
    }

    storeDefault() {
        store.commit(UPDATE_AXIOS_DEFAULT)
    }

}

export default Axios
