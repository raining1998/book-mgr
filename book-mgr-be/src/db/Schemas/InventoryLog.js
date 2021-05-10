//库存日志
const mongoose = require('mongoose');
const { getMeta,preSave } = require('../helpers');

const InventoryLogSchema = new mongoose.Schema({
    type:String,  //出or入
    num:Number,
    user:String,

    meta: getMeta(),
});

InventoryLogSchema.pre('save',preSave);

mongoose.model('InventoryLog',InventoryLogSchema);