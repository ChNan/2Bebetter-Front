import Axios from '../axios'

let _axios = new Axios()

//查询详情
export const getTimeConfig = (params, show, type) => {
    return _axios.get('timeConfig/get', params, show, type).then(res => res.data)
}
export const getTimeZons = (params, show, type) => {
    return _axios.get('winTimeZone/getList', params, show, type).then(res => res.data)
}
// //编辑通话设置
export const editTimeZone = (params, show, type) => {
    return _axios.post('timeConfig/edit', params, show, type)
}
