import Axios from '../axios'

let _axios = new Axios()

//查询详情
export const getTalkConfig = (params, show, type) => {
    return _axios.get('talkConfig/get', params, show, type).then(res => res.data)
}
//编辑通话设置
export const editTalkConfig = (params, show, type) => {
    return _axios.post('talkConfig/edit', params, show, type)
}
//查询国家
export const getCountry = (params, show, type) => {
    return _axios.get('country/getList', params, show, type).then(res => res.data)
}


