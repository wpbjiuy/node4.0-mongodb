var mongoose = require('mongoose'),
    Newsdir = mongoose.model('Newsdir'),
    News = mongoose.model('News')

// GET
exports.getNewsdir = function(req, res){
    Newsdir.find()
    .exec(function(err, results){
        if(results){
            res.json(results)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}
exports.getNews = function(req, res){
    var query = req.query
    var limit = parseInt(req.query.limit)||100,
        skip = ((parseInt(req.query.page)||1)-1)*limit
    // News.find({cId:query.id}).skip(skip).limit(limit)
    // .exec(function(err, results){
    //     if(results){
    //         res.json(results)
    //     }else{
    //         res.json(404, {msg:'No Content'})
    //     }
    // })
    News.find({cId:req.query.id})
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
exports.getNewsDedails = function(req, res){
    News.findOne({_id:req.query.id})
    .exec(function(err, result){
        if(result){
            res.json(result)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}

// POST
exports.createNewsdir = function(req, res){
    var newsdir = new Newsdir(req.body)
    newsdir.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}
exports.createNews = function(req, res){
    if(!req.body.cId){
       res.json(203, {msg:'Not cId!'})
       return; 
    }
    if(!req.body.vimg) req.body.vimg = ['/images/defulte.jpg'];
    var newNews = new News(req.body)
    newNews.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

//update
exports.updateNewsdir = function(req, res){
    Newsdir.findOneAndUpdate({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}
exports.updateNews = function(req, res){
    News.findOneAndUpdate({_id:req.body._id},{$set:req.body.update},function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}

// DELETE
exports.deleteNewsdir = function(req, res){
    News.remove({cId:req.body._id}, function(err, result){
        if(!err){
            Newsdir.findByIdAndRemove({_id:req.body._id}, function(err, result){
                if(!err){
                    res.json(200, {msg:'ok',content:result})
                }else{
                    res.json(202, {msg:err})
                }
            })
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.deleteNews = function(req, res){
    News.findByIdAndRemove({_id:req.body._id}, function(err, result){
        if(!err){
            res.json(200, {msg:'ok',content:result})
        }else{
            res.json(404, {msg:err})
        }
    })
}