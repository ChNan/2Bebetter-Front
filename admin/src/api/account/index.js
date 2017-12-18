import Axios from '../axios'

let _axios = new Axios()

export const getCurrentEnterprise = (params, show, type) => {
    return _axios.get('/enterprise/getCurrentEnterprise', params, show, type);
}

export const editEnterprise = (params, show, type) => {
    return _axios.post('/enterprise/editContactInfo', params, show, type);
}

export const changePassword = (params, show, type) => {
    return _axios.post('/managerAccount/changePassword', params, show, type);
}
export const getVersionList = (params, show, type) => {
    return _axios.get('/version/defaultIp', params, show, type);
}
export const getspList = (params, show, type) => {
    return _axios.get('/version/specifiedIp', params, show, type);
}

