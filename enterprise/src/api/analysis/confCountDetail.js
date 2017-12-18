import Axios from '../axios'

let _axios = new Axios()

//查询会议统计详情
export const getConfCountDetail = (params, show, type) => {
    return _axios.get('callRecord/get', params, show, type).then(res => res.data)
}
//查询参会者详情
export const getParticDetail = (params, show, type) => {
    return _axios.post('callRecord/getAttendancePagedList', params, show, type)
}

//编辑通话设置
// export const editTalkConfig = (params, show, type) => {
//     return _axios.post('talkConfig/edit', params, show, type)
// }
//查询国家
// export const getCountry = (params, show, type) => {
//     return _axios.get('country/getList', params, show, type).then(res => res.data)
// }
