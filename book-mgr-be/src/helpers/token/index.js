const jwt = require('jsonwebtoken');
const config = require('../../project.config');
const koaJwt = require('koa-jwt');

const getToken = (ctx) => {
    let {authorization} = ctx.header;

    return authorization.replace('Bearer ','').replace('bearer ','');
};

const verify = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token,config.JWT_SECRET,(err,payload)=>{
            if(err){
                reject(err);
                return;
            }

            resolve(payload);
        });
    });
};

const middleware = (app) => {
    app.use(koaJwt({
        secret:config.JWT_SECRET,
    }).unless({
        path:[ //那些路径不需要校验 
            /^\/auth\/login/,  //登录接口 正则
            /^\/auth\/register/,  //注册接口 正则
        ],
    }));
};

const catchTokenError = async (ctx,next) => {
    return next().catch((error) => {
        if(error.status === 401){
            ctx.status = 401;
            ctx.body = {
                code:0,
                msg:'token error',
            };                              
            throw error;
        }
    });
};

module.exports = {
    verify,
    getToken,
    middleware,
    catchTokenError,
};