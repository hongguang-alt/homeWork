const Koa = require('koa')
const app = new Koa()
// const bodyParser = require("koa-bodyparser")
const Router = require('koa-router')
const router = Router()
const KoaBody = require('koa-body')
const koaJwt = require('koa-jwt')
var cors = require('koa2-cors')

require('./model/connection')
const {
    secret
} = require('./config')

//关于post请求
// app.use(bodyParser())


//解决跨域问题
app.use(cors());


//中间件,上传文件的大小
app.use(KoaBody({
    multipart: true,
    formidable: {
        maxFields: 100 * 1024 * 1024
    }
}))

//自定义权限验证
app.use(function (ctx, next) {
    return next().catch((err) => {
        if (401 == err.status) {
            ctx.body = {
                status: '201',
                msg: '没有权限'
            }
        } else {
            throw err;
        }
    });
})

//进行权限验证，除了正则匹配的值
app.use(koaJwt({
    secret
}).unless({
    path: [/^\/user\/login$/, /^\/file\/downloadall$/, /^\/file\/download/]
}))

//接口分类
router.use('/user', require('./router/user'))
router.use('/file', require('./router/file'))


//登陆接口，数据处理
router.get('/login', async (ctx, next) => {
    ctx.body = '登陆成功'
})


app.use(router.routes())
app.listen(3001)