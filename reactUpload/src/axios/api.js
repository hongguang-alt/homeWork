import axios from './index'

//登陆接口
export const login = (parms) => {
    return axios.post('/user/login', {
        ...parms
    })
}

//获取文件内容的接口
export const getFileName = () => {
    return axios.get('/user/fileName')
}

//上传文件的接口
export const upload = (formdata) => {
    return axios.post('/file/uploadfile',
        formdata
    )
}

//修改密码的接口
export const password = (parms) => {
    return axios.post('/user/password', {
        ...parms
    })
}


//获取未上交作业名单的接口
export const noHomeWorkListName = () => {
    return axios.get('/user/noFileName')
}

//修改文件命名格式的接口
export const changeFileFormat = (param) => {
    return axios.post('/user/changeFile', {
        ...param
    })
}

//获取详情列表
export const detailList = () => {
    return axios.get('/user/detail')
}

//清空所有数据
export const deleteAll = () => {
    return axios.get('/file/deleteall')
}

//删除单个文件 
export const deteleOne = ({
    name
}) => {
    return axios.get('/file/delete/' + name)
}

//获取上传的文件名称
export const getUploadName = () => {
    return axios.get('/user/uploadName')
}

//修改文件名称的接口
export const changefileName = (value)=>{
    return axios.post('/file/changeName',{
        ...value
    })
}