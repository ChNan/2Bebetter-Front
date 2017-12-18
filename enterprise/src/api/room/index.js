import Axios from '../axios'

let _axios = new Axios()


//查询会议室详情
export const getRoom = (params, show, type) => {
    return _axios.get('room/get', params, show, type).then(res => res.data)
}

//查询会议室分页列表
export const getPagedList = (params, show, type) => {
    return _axios.post('room/getPagedList', params, show, type)
}

//新增会议室
export const addRoom = (params, show, type) => {
    return _axios.post('room/add', params, show, type)
}

//编辑会议室
export const editRoom = (params, show, type) => {
    return _axios.post('room/edit', params, show, type)
}

//删除会议室
export const deleteRoom = (params, show, type) => {
    return _axios.post('room/delete', params, show, type)
}

//部门下子部门重新排序
export const reIndex = (params, show, type) => {
    return _axios.post('roomCategory/reIndex', params, show, type)
}

//查询组织树（不包含会议室）
export const getCategoryTree = (params, show, type) => {
    return _axios.get('roomCategory/categoryTree', params, show, type).then(res => res.data)
}

//查询组织树（包含会议室）
export const getCategoryTreeWithRooms = (params, show, type) => {
    return _axios.get('roomCategory/categoryTreeWithRooms', params, show, type).then(res => res.data)
}

//查询组织下会议室
export const getRooms = (params, show, type) => {
    return _axios.get('roomCategory/rooms', params, show, type).then(res => res.data)
}

//查询组织详情
export const detailRoomCategory = (params, show, type) => {
    return _axios.get('roomCategory/detail', params, show, type).then(res => res.data)
}

//查询组织子树（不包含会议室）
export const subCategoryTreeWithRooms = (params, show, type) => {
    return _axios.get('roomCategory/subCategoryTreeWithRooms', params, show, type).then(res => res.data)
}

//新增分组
export const addRoomCategory = (params, show, type) => {
    return _axios.post('roomCategory/add', params, show, type)
}

//修改分组
export const editRoomCategory = (params, show, type) => {
    return _axios.post('roomCategory/edit', params, show, type)
}

//移动分组
export const moveRoomCategory = (params, show, type) => {
    return _axios.post('roomCategory/move', params, show, type)
}

//删除分组
export const deleteRoomCategory = (params, show, type) => {
    return _axios.post('roomCategory/delete', params, show, type)
}