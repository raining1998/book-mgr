const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
//const { getBody } = require('../../helpers/utils/index');

const InviteCode = mongoose.model('InviteCode');

const router = new Router({
    prefix:'/invite',
});

//实际上该使用 post    此处写 get 是为了方便调试
router.get('/add',async (ctx) => {
    const code = new InviteCode({
        code:uuidv4(),
        user:'',
    });
    const saved = await code.save();

    ctx.body = { 
        code:1,
        data:saved,
        msg:'创建成功',
    }
});

module.exports = router;
