//中间键-》处理日志的相关内容
const {verify,getToken} = require('../token');
const mongoose = require('mongoose');

const Log = mongoose.model('Log');
const LogResponse = mongoose.model('LogResponse');

const logMiddleware = async (ctx, next) => {
    //记录基础信息
    const startTime = Date.now();//开始时间

    await next();

    let payload = {};
    try {
        payload = await verify(getToken(ctx)); //解析token获取用户信息
    } catch (e) {
        payload = {
        account: '未知用户',
        id: '',
        };
    }

    //http状态：
    const url = ctx.url;
    const method = ctx.method;
    const status = ctx.status;
    let show = true;

    //删除不做记录
    if(url === '/log/delete'){
      show = false;
    }

    let responseBody = '';

    if (typeof ctx.body === 'string') {
      responseBody = ctx.body;
    } else {
      try {
        responseBody = JSON.stringify(ctx.body); //不是字符串 就转化为JSON
      } catch {
        responseBody = '';
      }
    }    

    const endTime = Date.now();//结束时间

    const log = new Log({
        user:{
            account: payload.account,
            id: payload.id,
        },
        request:{
            url,
            method,
            status,
        },

        endTime,
        startTime,
        show,
    });

    log.save();

    const logRes = new LogResponse({
      logId: log._id,
      data: responseBody,
    });
  
    logRes.save();
};

module.exports = {
    logMiddleware,
};