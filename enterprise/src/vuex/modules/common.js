import * as types from '../mutation-types'

/*
 * ======axios=======
 * @showLoading 是否显示加载中
 * @alarmType 提示类型 1.warning(默认) 2. alert  3.success  4.info  6.error  7.''
 * ======axios=======
 *
 * */
const state = {
    axios: {
        showLoading: true,
        alarmType: ''
    }
}

// getters
const getters = {
    getTableHeight: state => {
        return state.tableHeight
    }
}

// actions
const actions = {}

// mutations
const mutations = {
    [types.UPDATE_AXIOS_LOADING] (state, showLoading) {
        state.axios.showLoading = showLoading
    },
    [types.UPDATE_AXIOS_ALARM_TYPE] (state, alarmType) {
        state.axios.alarmType = alarmType
    },
    [types.UPDATE_AXIOS_DEFAULT] (state) {
        state.axios.alarmType = 'warning'
        state.axios.showLoading = true
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
