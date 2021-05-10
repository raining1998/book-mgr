//邀请码
const mongoose = require('mongoose');
const { getMeta,preSave } = require('../helpers');

const InviteCodeSchema = new mongoose.Schema({
   //邀请码
   code:String,
   //记录邀请码使用的用户  一开始该字段为空
   user:String,

    meta: getMeta(),
});

InviteCodeSchema.pre('save',preSave);

mongoose.model('InviteCode',InviteCodeSchema);