const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const config = require('../../project.config');
const {verify,getToken} = require('../../helpers/token');

//const { getBody } = require('../../helpers/utils/index');

const User = mongoose.model('User');
const Character = mongoose.model('Character');

const router = new Router({
    prefix:'/user',
});

router.get('/list',async(ctx) => {
    let{ //变量
        page,
        size,
        keyword,
    } = ctx.query;

    page = Number(page);
    size = Number(size);

    const query = {};
    if(keyword){
        query.account = keyword;
    }

    const list = await User
        .find(query)
        .sort({
            _id:-1, //倒序 -1
        })
        .skip((page - 1) * size)
        .limit(size)
        .exec();
    
    const total = await User.countDocuments().exec();

    ctx.body = {
        msg:'获取列表成功',
        data:{
            list,
            page,
            size,
            total,
        },
        code:1,
    }
});

//删除接口
router.delete('/:id',async(ctx) => {
    const{
        id,
    } = ctx.params;

    const delMsg = await User.deleteOne({
        _id:id,
    });

    ctx.body = {
        data:delMsg,
        code:1,
        msg:'删除成功',
    };
});

//添加用户
router.post('/add',async(ctx) => {
    const{
        account,
        password,
        character,
    } = ctx.request.body;

    const char = await Character.findOne({
        _id:character,
    });

    if(!char){
        ctx.body = {
            msg:'出错了',
            code:0,
        };
        return;
    }

    const user = new User({
        account,
        password:password || '123456',//默认密码123456 
        character,
    });

    const res = await user.save()

    ctx.body = {
        data:res,
        code:1,
        msg:'添加成功',
    };
});

//重置密码
router.post('/reset/password',async(ctx) => {
    const{
        id,
    } = ctx.request.body;

    const user = await User.findOne({
        _id:id,
    }).exec();

    if(!user){
        ctx.body = {
            msg:'找不到用户',
            code:0,
        };
        return;
    }

    user.password = config.DEFAULT_PASSWORD;

    const res = await user.save();

    ctx.body = {
        msg:'重置密码成功',
        data:{
            account:res.account,
            _id:res._id,
        },
        code:1,
    };
});

//角色修改
router.post('/update/character',async(ctx) => {
    const{
        character,
        userId,
    } = ctx.request.body;
    
    const char = await Character.findOne({
        _id:character,
    });
    if(!char){
        ctx.body = {
            msg:'出错了',
            code:0,
        };
        return;
    }

    const user = await User.findOne({
        _id:userId,
    });
    if(!user){
        ctx.body = {
            msg:'出错了',
            code:0,
        };
        return;
    };

    user.character = character;
    const res = await user.save();
    ctx.body = {
        data:res,
        code:1,
        msg:'修改成功',
    };
});

router.get('/info',async(ctx) => {
    //token是从前端带上来的 放在http请求 header里 请求头在Authorization：Bearer $%^64787hgsd 
    //console.log(getToken(ctx));
    ctx.body = { 
        data:await verify(getToken(ctx)),
        code:1,
        msg:'获取成功',
    };
});

module.exports = router;
