import Axios from '../axios'

let _axios = new Axios()

//查询详情
export const getEnterprise = (params, show, type) => {
    return _axios.get('enterprise/getCurrentEnterprise', params, show, type).then(res => res.data)
}
//编辑通话设置
export const editEnterprise = (params, show, type) => {
    return _axios.post('enterprise/edit', params, show, type)
}
//查询国家
export const getCountry = (params, show, type) => {
    return _axios.get('country/getList', params, show, type).then(res => res.data)
}
