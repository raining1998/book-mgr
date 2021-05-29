const mongoose = require('mongoose');
const { getMeta,preSave } = require('../helpers');

const BookClassifySchema = new mongoose.Schema({
    title:String,//展示文案 图书分类名

    meta: getMeta(),
});

BookClassifySchema.pre('save',preSave);

mongoose.model('BookClassify',BookClassifySchema);