var crypto = require('crypto')
var mongoose = require('mongoose'),
    User = mongoose.model('User')

function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString()
}
// GET
exports.getUser = function(req, res){
    if(req.query.username){
        User.findOne({username:req.query.username})
        .exec(function(err, results){
            if( !err && results.password === hashPW(req.query.password.toString()) ){
                res.json(200,{msg:'ok'})
            }else{
                res.json(404, {msg:'No Content'})
            }
        })
    }else{
        User.find()
        .exec(function(err, results){
            if(results){
                res.json(results)
            }else{
                res.json(404, {msg:'No Content'})
            }
        })
    }
}

exports.login = function(req, res){
    var body = req.body

    User.findOne({username:body.username})
    .exec(function (err, user) {
        if(!user){
            err = 'User Not Found.'
        }else if(user.password === hashPW(body.password.toString())){
            req.session.regenerate(function () {
                req.session.user = user._id
                req.session.username = user.username
                req.session.type = user.type
                req.session.msg = 'Authenticated as ' + user.username
                res.json(200,req.session)
                // res.redirect('/main')
            })
        }else{
            err = 'Authenticated failed.'
        }
        if(err){
            req.session.regenerate(function () {
                req.session.msg = err
                res.redirect('/login')
            })
        }
    })
}

// POST
exports.createUser = function(req, res){console.log(req.session.type)
    if(req.session.type != 'a'){
        res.json(202, {msg:'Have no legal power'})
        return;
    }
    req.body.password = hashPW(req.body.password)
    var newUser = new User(req.body)
    newUser.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

// DELETE
exports.deleteUser = function(req, res){
    if(req.session.user == req.body._id){
        res.json(202, {msg:"Can't delete my"})
        return;
    }
    User.findByIdAndRemove({_id:req.body._id}, function(err, results){
        if(!err){
            res.json(200, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

//update
exports.updateUser = function(req, res){
    if(req.session.type != 'a' && req.session.username != req.body.update.username){
        res.json(202, {msg:'Have no legal power'})
        return;
    }
    req.body.update.password = hashPW(req.body.update.password)

    User.findOne({_id:req.body._id})
    .exec(function(err, user){
        if(!err){
            if(req.body.update.password == user.password){
                req.body.update.password = hashPW(req.body.update.newPassword)
                fnUpdateUser(req, res)
            }else{
                res.json(202, {msg:'Original password is not correct!'})
            }
        }else{
            res.json(404, {msg:'No Content'})
        }
    })

}

function fnUpdateUser(req,res){
    User.update({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(200, {msg:'ok',content:req.body.update})
        }
    })
}