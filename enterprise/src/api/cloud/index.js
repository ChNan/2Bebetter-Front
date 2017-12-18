import Axios from '../axios'

let _axios = new Axios()

//新增分组
export const addCategory = (params, show, type) => {
    return _axios.post('vmrCategory/add', params, show, type)
}

//修改分组
export const editCategory = (params, show, type) => {
    return _axios.post('vmrCategory/edit', params, show, type)
}

//移动分组
export const reIndex = (params, show, type) => {
    return _axios.post('vmrCategory/reIndex', params, show, type)
}

//获取云会场详情
export const getVmr = (params, show, type) => {
    return _axios.get('vmr/get', params, show, type).then(res => res.data)
}

//新增云会场
export const addVmr = (params, show, type) => {
    return _axios.post('vmr/add', params, show, type)
}

//修改云会场
export const editVmr = (params, show, type) => {
    return _axios.post('vmr/edit', params, show, type)
}

//删除云会场
export const deleteVmr = (params, show, type) => {
    return _axios.post('vmr/delete', params, show, type)
}

//禁用云会场
export const disableVmr = (params, show, type) => {
    return _axios.post('vmr/disable', params, show, type)
}

//删除分组
export const deleteCategory = (params, show, type) => {
    return _axios.post('vmrCategory/delete', params, show, type)
}

//查询组织树（包含云会场）
export const getCategoryTreeWithVmrs = (params, show, type) => {
    return _axios.get('vmrCategory/categoryTreeWithVmrs', params, show, type).then(res => res.data)
}

//查询组织树（不包含云会场）
export const getCategoryTree = (params, show, type) => {
    return _axios.get('vmrCategory/categoryTree', params, show, type).then(res => res.data)
}

//获取云会场分页列表
export const getPagedList = (params, show, type) => {
    return _axios.post('vmr/getPagedList', params, show, type)
}