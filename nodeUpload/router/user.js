const Router = require('koa-router')
const router = Router()
const jwt = require('jsonwebtoken')
const {
    secret
} = require('../config')
const Student = require('../model/student')
const fileName = require('../model/fileName')


//登陆接口
router.post('/login', async ctx => {
    let res = await Student.findOne(ctx.request.body)
    if (!res) {
        ctx.body = {
            status: '201',
            msg: '学号或者密码错误'
        }
    } else {
        const {
            name,
            role,
            sid
        } = res
        let userToken = {
            name: name,
            role: role,
            sid: sid
        }
        //签发token
        let token = jwt.sign(userToken, secret, {
            expiresIn: '24h'
        })
        ctx.body = {
            status: '200',
            token: token,
            msg: '登陆成功'
        }
    }
})

//修改密码的接口
router.post('/password', async ctx => {
    const {
        oldPassword,
        newPassword
    } = ctx.request.body
    let userInfo = jwt.verify(ctx.request.header.authorization.split(' ')[1], secret)
    let res = await Student.findOne({
        name: userInfo.name
    })
    if (res) {
        if (res.password === oldPassword) {
            await Student.updateOne(res, {
                "password": newPassword
            })
            ctx.body = {
                status: '200',
                msg: '密码修改成功'
            }
        } else {
            ctx.body = {
                status: '201',
                msg: '旧密码错误'
            }
        }
    } else {
        ctx.body = {
            status: '201',
            msg: '用户不存在，token存在错误'
        }
    }
})

//获取文件命名信息
router.get('/fileName', async ctx => {
    let res = await fileName.find({})
    console.log(res)
    const {
        content,
        format
    } = res[0]
    ctx.body = {
        status: '200',
        msg: '获取成功',
        data: {
            content,
            format
        }
    }
})

//修改文件命名的信息
router.post('/changeFile', async ctx => {
    const {
        content,
        format
    } = ctx.request.body
    if (!content || !format) {
        return ctx.body = {
            status: '200',
            msg: '修改失败'
        }
    } else {
        await fileName.updateOne({}, {
            content,
            format
        })
        ctx.body = {
            status: '200',
            msg: '修改成功'
        }
    }
})

//作业未上交名单
router.get('/noFileName', async ctx => {
    let res = await Student.find({
        fileName: '' || null
    })
    let data = []
    res.map(item => {
        data.push(item.name)
    })
    ctx.body = {
        status: '200',
        msg: '作业名单获取成功',
        data: {
            data
        }
    }
})

//获取作业详情名单
router.get('/detail', async ctx => {
    let res = await Student.find({
        fileName: {
            "$gt": ''
        }
    })
    let data = []
    res.map((item, index) => {
        data.push({
            name: item.name,
            sid: item.sid,
            fileName: item.fileName,
            ctime: item.ctime,
            key: index
        })
    })
    ctx.body = {
        msg: "获取列表成功",
        status: '200',
        data: {
            data
        }
    }
})


module.exports = router.routes()