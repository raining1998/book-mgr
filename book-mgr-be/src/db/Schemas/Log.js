const mongoose = require('mongoose');
const { getMeta,preSave } = require('../helpers');

const LogSchema = new mongoose.Schema({
    user:{
        account:String,
        id:String,
    },

    request:{
        method:String, //http请求用什么方法来处理的
        url:String,
        status:Number,
    },

    startTime:Number,
    endTime:Number,

    show:Boolean, //显示or隐藏

    meta: getMeta(),
});

LogSchema.pre('save',preSave);

mongoose.model('Log',LogSchema);