const Router = require('@koa/router');
const mongoose = require('mongoose');
const { getBody } = require('../../helpers/utils/index');
const jwt = require('jsonwebtoken');
const config = require('../../project.config');

const User = mongoose.model('User');
const InviteCode = mongoose.model('InviteCode');

const router = new Router({
    prefix:'/auth',
});
//-----------------注册
router.post('/register',async(ctx) => {
    const {
        account,
        password,
        inviteCode,
    } = getBody(ctx);

    //做表单校验
    if(account === '' || password === '' || inviteCode === ''){
        ctx.body={
            code:0,
            msg:'字段不能为空',
            data:null,
        };
        return;
    }

    //找有没有邀请码
    const findCode = await InviteCode.findOne({
        code:inviteCode,
    }).exec();

    //没有找到邀请码 或者  邀请码被使用
    if((!findCode) || findCode.user){
        ctx.body={
            code:0,
            msg:'邀请码不正确',
            data:null,
        }; 
        return;
    }

    //去找 account 为 传递上来的 “account” 的用户
    const findUser =await User.findOne({
        account,
    }).exec();

    //判断有没有用户
    if(findUser){
        //如果有 表示已经存在
        ctx.body={
            code:0,
            msg:'已存在该用户',
            data:null,
        };
        return;
    }
    //创建一个用户
    const user = new User({
        account,
        password,
    });
  
    //把创建的用户同步到 mongodb
    const res = await user.save();

    findCode.user = res._id;
    findCode.meta.updateAt = new Date().getTime();
    await findCode.save();

    //响应成功
    ctx.body={
        code:1,
        msg:'注册成功',
        data:res,
    };
});
//-------------登陆
router.post('/login',async(ctx) => {
    const {
        account,
        password,
    } = getBody(ctx);

    if(account === '' || password === ''){
        ctx.body={
            code:0,
            msg:'字段不能为空',
            data:null,
        };
        return;
    }
   
    const one = await User.findOne({
        account,
    }).exec();

    // console.log(account,password);
    // console.log(one.account,one.password);

    if(!one){
        ctx.body = {
            code:0,
            msg:'用户名或密码错误',
            data:null,
        };
        return;
    }

    const user = {
        account: one.account,
        character:one.character,
        _id:one._id,
    };

    if(one.password === password){
        ctx.body = {
            code:1,
            msg:'登陆成功',
            data:{
                user,
                token:jwt.sign(user,config.JWT_SECRET),
            },
        };
        return;
    }

    //console.log(one);
    ctx.body = {
        code:0,
        msg:'用户名或密码错误',
        data:null,
    };
});

module.exports = router;
