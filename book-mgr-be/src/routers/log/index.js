//获取日志列表的接口
const Router = require('@koa/router');
const mongoose = require('mongoose');
//const { getBody } = require('../../helpers/utils/index');

const Log = mongoose.model('Log');

const router = new Router({
    prefix:'/log',
});

router.get('/list',async(ctx) => {
    let{ //分页信息
        page,
        size,
    } = ctx.query;
    page = Number(page);
    size = Number(size);

    const list = await Log
        .find({
            show:true,
        })
        .sort({
            _id:-1,
        })
        .skip((page-1)*size)
        .limit(size)
        .exec();

    const total = await Log.countDocuments().exec();//总数

    ctx.body = {
        data:{
            list,
            page,
            size,
            total,
        },
        code:1,
        msg:'获取列表成功',
    };
});

router.post('/delete', async (ctx) => {
    const {
      id,
    } = ctx.request.body;
  
    const one = await Log.findOne({
      _id: id,
    }).exec();
  
    if (!one) {
      ctx.body = {
        data: {},
        msg: '删除成功',
        code: 0,
      };
      return;
    }
  
    one.show = false;
  
    await one.save();
  
    ctx.body = {
      code: 1,
      msg: '删除成功',
    };
});

module.exports = router;
