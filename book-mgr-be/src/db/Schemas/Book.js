const mongoose = require('mongoose');
const { getMeta,preSave } = require('../helpers');

const BookSchema = new mongoose.Schema({
    //图书名
    name:String,
    //分类
    classify:String,
    //作者
    author:String,
    //出版日期
    publishDate:String,
    //价格
    price:String,
    //库存
    count:Number,
    
    meta: getMeta(),
});

BookSchema.pre('save',preSave);

mongoose.model('Book',BookSchema);