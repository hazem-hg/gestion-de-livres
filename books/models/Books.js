const mongoose = require('mongoose');
const express = require('express');
const mongoosePagination = require('mongoose-paginate-v2');
const { TextEncoder, TextDecoder } = require("util");

const bookSchema = new mongoose.Schema({
    title : {type : String,required:true},
    author : {type : String,required:true},
    price : {type : Number,required:true},
    publisingDate : {type : Date,default:new Date()},
    available : {type : Boolean,default:true},
    quantity : {type : Number,required:true,default : 0},
});
bookSchema.plugin(mongoosePagination);
module.exports = mongoose.model('Book',bookSchema);



