var mongoose = require('mongoose'),
    fs = require('fs'),
    Imgdir = mongoose.model('Imgdir'),
    Img = mongoose.model('Img')

// GET
exports.getImgdir = function(req, res){
    Imgdir.find()
    .exec(function(err, results){
        if(results){
            res.json(results)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}
exports.getImg = function(req, res){
    var query = req.query
    var limit = parseInt(query.limit)||100,
        skip = ((parseInt(query.page)||1)-1)*limit
    // Img.find({cId:query.id}).skip(skip).limit(limit)
    // .exec(function(err, results){
    //     if(results){
    //         res.json(200,{data:results})
    //     }else{
    //         res.json(404, {msg:'No Content'})
    //     }
    // })
    Img.find({cId:req.query.id})
    .exec(function(err, results){
        if(results){
            res.json(200,{
                data:results.slice(skip,limit+skip),
                pages:Math.ceil(results.length/limit),
                amount:results.length
            })
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}

// POST
exports.createImgdir = function(req, res){
    var newFrildir = new Imgdir(req.body)
    newFrildir.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.createImg = function(req, res){
    if(!req.body.cId){
       res.json(203, {msg:'Not cId!'})
       return; 
    }
    var newImg = new Img(req.body)
    newImg.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

// DELETE
exports.deleteImgdir = function(req, res){
    Img.remove({cId:req.body._id}, function(err, results){
        if(!err){console.log(results)
            Imgdir.findByIdAndRemove({_id:req.body._id}, function(err, result){
                if(!err){ 
                    res.json(200, {msg:'ok',content:result})
                }else{
                    res.json(404, {msg:err})
                }
            })
           // deleteImgFile(req.body.path,res,result)
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.deleteImg = function(req, res){
    if(!req.body._id || !req.body.path){
        res.json(401, {msg:'Parameter is not correct！'})
    }
    Img.findByIdAndRemove({_id:req.body._id}, function(err, result){
        if(!err){
           deleteImgFile(req.body.path,res,result)
        }else{
            res.json(404, {msg:err})
        }
    })
}

//update
exports.updateImgdir = function(req, res){
    Imgdir.findOneAndUpdate({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}
exports.updateImg = function(req, res){
    Img.update({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}


//delele img file
function deleteImgFile(path,res,results){
    fs.unlink('..'+path, function(err){
        if(err)
            res.json(200, {msg:'Not delete the file path!',content:results})
        else
            res.json(200, {msg:'Delete the success',content:results})
    })
}