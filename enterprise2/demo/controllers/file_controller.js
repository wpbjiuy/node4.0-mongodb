var mongoose = require('mongoose'),
    Filedir = mongoose.model('Filedir'),
    File = mongoose.model('File')

// GET
exports.getFiledir = function(req, res){
    Filedir.find()
    .exec(function(err, results){
        if(results){
            res.json(results)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}
exports.getFile = function(req, res){
    var query = req.query
    File.find({cId:query.id})
    .exec(function(err, results){
        if(results){
            res.json(200,{data:results})
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}
exports.getFileOne = function(req, res){
    var query = req.query
    File.findOne({_id:query.id})
    .exec(function(err, result){
        if(result){
            res.json(200, result)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}

// POST
exports.createFiledir = function(req, res){
    var newFrildir = new Filedir(req.body)
    newFrildir.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.createFile = function(req, res){
    if(!req.body.cId){
       res.json(203, {msg:'Not cId!'})
       return; 
    }
    var newFile = new File(req.body)
    newFile.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

// DELETE
exports.deleteFiledir = function(req, res){
    File.remove({cId:req.body._id}, function(err, results){
        if(!err){
            Filedir.findByIdAndRemove({_id:req.body._id}, function(err, results){
                if(!err){
                    res.json(200, {msg:'ok',content:results})
                }else{
                    res.json(202, {msg:err})
                }
            })
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.deleteFile = function(req, res){
    File.findByIdAndRemove({_id:req.body._id}, function(err, results){
        if(!err){
            res.json(200, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

//update
exports.updateFiledir = function(req, res){
    Filedir.findOneAndUpdate({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}
exports.updateFile = function(req, res){
    File.findOneAndUpdate({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}