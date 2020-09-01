const Router = require('koa-router')
const router = Router()
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const jsZip = require('jszip')
const jwt = require('jsonwebtoken')
const {
    ZIP,
    ZIP_NAME,
    secret
} = require('../config')
const Student = require('../model/student')

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
    const file = ctx.request.files.file //获得上传文件
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
router.get('/downloadall/:token', async (ctx) => {
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
    //压缩成包
    let zip = new jsZip()
    //读取目录
    let files = await fs.readdirSync('upload')
    files.forEach(item => {
        let content = fs.readFileSync(`upload/${item}`, {
            encoding: "utf-8"
        })
        zip.file(item, content)
    })
    await zip.generateAsync({
        type: "nodebuffer"
    }).then((content) => {
        fs.writeFileSync(path.join(ZIP, ZIP_NAME), content, async (err) => {
            console.log(err, '压缩文件添加出错')
        })
    })
    const pathUrl = path.join(ZIP, ZIP_NAME)
    await ctx.attachment(pathUrl)
    await send(ctx, pathUrl)
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

module.exports = router.routes()