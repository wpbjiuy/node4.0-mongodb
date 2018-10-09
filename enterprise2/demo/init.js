var crypto = require('crypto')
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost:27017/cm')
require('./models/model.js')
var Filedir = mongoose.model('Filedir'),
    File = mongoose.model('File'),
    Productdir = mongoose.model('Productdir'),
    Products = mongoose.model('Product'),
    Newsdir = mongoose.model('Newsdir'),
    News = mongoose.model('News'),
    Imgdir = mongoose.model('Imgdir'),
    Img = mongoose.model('Img'),
    User = mongoose.model('User')

var files = [
    {name:'公司简介', describe:'test'},
    {name:'公司荣誉', describe:'test'}
]

Filedir.remove().exec(function(){
    for (var i = 0; i < files.length; i++) {
        var file = new Filedir(files[i])
        file.save(function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result.name+' is save Ok!')
            }
        })
    }
})
File.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
Productdir.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
Products.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
Newsdir.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
News.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
Imgdir.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})
Img.remove().exec(function(err,result){
    if(err){
        console.log(err)
    }else{
        console.log(result)
    }
})


function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString()
}
User.remove().exec(function(){
    var user = new User({username:'admin', password:hashPW('admin'), type:'a'})
    user.save(function(err, result){
        if(err){
            console.log(err)
        }else{
            console.log(result.username+' is save Ok!')
        }
    })
})