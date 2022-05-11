const mongoose =require('mongoose')
 const moment = require('moment')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema= new mongoose.Schema({
    title: {type:String,require: true, unique:true, trim:true},
    excerpt: {type:String,require: true}, 
    userId: {type:ObjectId,require: true, ref:'user'},
    ISBN: {type:String,require: true, unique:true},
    category: {type:String,require: true},
    subcategory: [{type:String,require:true}],
    reviews: {types:Number, default: 0},
  deletedAt: {type:Date, default:null}, 
    isDeleted: {type:Boolean, default: false},
   releasedAt: {type:Date,default:moment(Date.now()).format("YYYY-MM-DD"),require: true},
 
},{timestamps:true});

module.exports =mongoose.model('book',bookSchema)