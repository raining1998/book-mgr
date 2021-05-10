//每个文件都是一个模块
const Koa = require('koa'); //引进koa包
const koaBody = require('koa-body');
const {connect} = require('./db');
const registerRoutes = require('./routers');
const {middleware:koaJwtMiddleware,catchTokenError} = require('./helpers/token');
const cors = require('@koa/cors');

const app = new Koa();

connect().then(() => {
    app.use(cors());
    app.use(koaBody());

    app.use(catchTokenError); //一定要在 koaJwtMiddleware(app); 之前

    koaJwtMiddleware(app);
    
    registerRoutes(app);

    //开启一个http服务
    //接受http请求 并作处理  处理后响应
    app.listen(3000,()=>{
        console.log('启动成功');
    });
});
