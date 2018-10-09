var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var NewsSchema = new Schema({
    cId:String,
    name:String,
    vimg:Array,
    author:String,
    releaseTime:{type:Date, default:Date.now},
    describe:String,
    details:String
})
var NewsdirSchema = new Schema({
    name:String,
    describe:String,
    content:[NewsSchema]
})

var ProductSchema = new Schema({
    cId:String,
    name:String,
    vimg:Array,
    imagefile:Array,
    describe:String,
    details:String
})
var nextdirSchema = new Schema({
    name:String,
    describe:String,
    content:[ProductSchema]
})
var ProductdirSchema = new Schema({
    name:String,
    describe:String,
    isAs:{type:Boolean, default:true},
    nextdir:[nextdirSchema],
    content:[ProductSchema]
})

var FileSchema = new Schema({
    cId:String,
    name:String,
    describe:String,
    details:String
})
var FiledirSchema = new Schema({
    name:String,
    describe:String,
    content:[FileSchema]
})

var ImgSchema = new Schema({
    cId:String,
    path:String,
    describe:String
})
var ImgdirSchema = new Schema({
    name:String,
    describe:String,
    content:[FileSchema]
})

var UserSchema = new Schema({
    username:String,
    password:String,
    type:String
})

mongoose.model('Newsdir', NewsdirSchema)
mongoose.model('News', NewsSchema)
mongoose.model('Productdir', ProductdirSchema)
mongoose.model('Product', ProductSchema)
mongoose.model('Filedir', FiledirSchema)
mongoose.model('File', FileSchema)
mongoose.model('Imgdir', ImgdirSchema)
mongoose.model('Img', ImgSchema)
mongoose.model('User', UserSchema)