//每个文件都是一个模块
const Koa = require('koa'); //引进koa包
const koaBody = require('koa-body');
const {connect} = require('./db');
const registerRoutes = require('./routers');
const {middleware:koaJwtMiddleware,catchTokenError, checkUser} = require('./helpers/token');
const {logMiddleware} = require('./helpers/log');
const cors = require('@koa/cors');

const app = new Koa(); //生成实例赋值给app

connect().then(() => {
    app.use(cors());
    app.use(koaBody());

    app.use(catchTokenError); //一定要在 koaJwtMiddleware(app); 

    koaJwtMiddleware(app);

 
    app.use(logMiddleware);

    registerRoutes(app);

    //开启一个http服务
    //接受http请求 并作处理  处理后响应
    app.listen(3000,()=>{
        console.log('启动成功');
    });
});
