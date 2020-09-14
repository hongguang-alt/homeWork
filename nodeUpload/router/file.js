const Router = require('koa-router')
const router = Router()
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const jsZip = require('jszip')
const jwt = require('jsonwebtoken')
const {
    ZIP,
    secret
} = require('../config')
const Student = require('../model/student')
const iconv = require('iconv-lite')


const {
    asyncRes
} = require('./util')

//上传接口，文件处理
router.post('/uploadfile', async (ctx, next) => {
    let userInfo = jwt.verify(ctx.request.header.authorization.split(' ')[1], secret)
    let res = await Student.findOne({
        'sid': userInfo.sid
    })
    if (res.fileName) {
        return ctx.body = {
            status: '201',
            msg: '请不要重复上传！'
        }
    }

    //正式提交上传文件
    const file = ctx.request.files.file
    //存放在临时目录上
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../upload' + `/${file.name}`)

    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)

    await Student.updateOne({
        'sid': userInfo.sid
    }, {
        'fileName': file.name,
        "ctime": new Date()
    })


    return ctx.body = {
        msg: '上传文件成功',
        status: '200'
    }
})


//下载单个接口，文件处理
router.get('/download/:name/:token', async (ctx) => {
    let userInfo = jwt.verify(ctx.params.token, secret)
    let res = await Student.findOne({
        'sid': userInfo.sid
    })
    if (!res) {
        return ctx.body = {
            status: '201',
            msg: '没有权限'
        }
    }
    const name = ctx.params.name
    const pathUrl = `upload/${name}`
    ctx.attachment(pathUrl)
    await send(ctx, pathUrl)
})

//下载全部的接口，文件处理,对于token的值进行解析
router.get('/downloadall/:name/:token', async (ctx) => {
    let userInfo = jwt.verify(ctx.params.token, secret)
    let ZIP_NAME = ctx.params.name
    let res = await Student.findOne({
        'sid': userInfo.sid
    })
    if (!res) {
        return ctx.body = {
            status: '201',
            msg: '没有权限'
        }
    }
    //压缩成包
    let zip = new jsZip()
    //读取目录
    let files = await fs.readdirSync('upload')
    files.forEach(async item => {
        //使用steam是不会乱码的
        const reader = fs.createReadStream(`upload/${item}`)
        await zip.file(item, reader);
    })
    let reslute = await asyncRes(zip)
    if (reslute) {
        const pathUrl = path.join(ZIP, ZIP_NAME)
        await ctx.attachment(pathUrl)
        await send(ctx, pathUrl)
    }
})

//清除全部数据
router.get('/deleteall', async ctx => {
    let uploadFiles = await fs.readdirSync('upload')
    let loadFiles = await fs.readdirSync(ZIP)
    await Student.update({}, {
        "fileName": ''
    }, {
        multi: true
    })

    if (uploadFiles.length == 0 && loadFiles.length == 0) {
        return ctx.body = {
            status: '200',
            msg: '清除数据成功',
        }
    } else {
        uploadFiles.forEach(async item => {
            await fs.unlink(`upload/${item}`, () => {})
        })
        await fs.unlink(path.join(ZIP, ZIP_NAME), (err) => {
            console.log(err, '删除压缩包出错')
        })
    }
    return ctx.body = {
        status: '200',
        msg: '删除数据成功',
    }
})

//清除单个文件
router.get('/delete/:name', async ctx => {
    const name = ctx.params.name
    await Student.updateOne({
        "fileName": name
    }, {
        "fileName": ''
    })
    await fs.unlink(`upload/${name}`, () => {})
    ctx.body = {
        status: '200',
        msg: '删除成功'
    }
})

//修改文件名称的接口
router.post('/changeName', async ctx => {
    const {
        sid,
        name
    } = ctx.request.body
    let res = await Student.findOne({
        sid: sid
    })
    let files = fs.readdirSync('upload')
    let newName = name + '.' + res.fileName.split('.').pop()
    files.forEach(async item => {
        if (item === res.fileName) {
            try {
                await fs.renameSync(`upload/${item}`, `upload/${newName}`)
            } catch (e) {
                ctx.body = {
                    status: 201,
                    msg: '修改文件名失败'
                }
            }
        }
    })
    await Student.updateOne({
        sid
    }, {
        fileName: newName
    })
    ctx.body = {
        status: '200',
        msg: '修改文件名成功'
    }
})


module.exports = router.routes()