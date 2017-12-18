import Axios from '../axios'

let _axios = new Axios()

//查询会议统计详情
export const getPortMsg = (params, show, type) => {
    return _axios.post('conferencePortSummary/portSummary', params, show, type)
}

//查询通话概况
export const getCallRecordMsg = (params, show, type) => {
    return _axios.get('callRecord/callRecordSummary', params, show, type).then(res => res.data)
}

//查询通话记录
export const  getCallRecordListMsg = (params, show, type) => {
    return _axios.post('callRecord/getPagedList', params, show, type)
}

//导出通话记录
export const  getExportMsg = (params, show, type) => {
    return _axios.get('callRecord/download', params, show, type).then(res => res.data)
}



