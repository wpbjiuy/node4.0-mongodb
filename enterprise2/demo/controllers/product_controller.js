var mongoose = require('mongoose'),
    Productdir = mongoose.model('Productdir'),
    Products = mongoose.model('Product')

// GET
exports.getProductdir = function(req, res){
    Productdir.find()
    .exec(function(err, results){
        if(results){
            res.json(results)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}
exports.getProducts = function(req, res){
    var limit = parseInt(req.query.limit)||100,
        skip = ((parseInt(req.query.page)||1)-1)*limit

    Products.find({cId:req.query.id})
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
exports.getProduct = function(req, res){
    Products.findOne({_id:req.query.id})
    .exec(function(err, result){
        if(result){
            res.json(result)
        }else{
            res.json(404, {msg:'No Content'})
        }
    })
}


// POST
exports.createProductdir = function(req, res){
    var newProductdir = new Productdir(req.body)
    newProductdir.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

exports.createProducts = function(req, res){
    if(!req.body.cId){
       res.json(203, {msg:'Not cId!'})
       return; 
    }
    if(!req.body.vimg) req.body.vimg = ['/images/defulte.jpg'];
    var newProducts = new Products(req.body)
    newProducts.save(function(err, results){
        if(!err){
            res.json(201, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}


// DELETE
exports.deleteProductdir = function(req, res){
    Products.remove({cId:req.body._id}, function(err, results){
        if(!err){
            Productdir.findByIdAndRemove({_id:req.body._id}, function(err, results){
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

exports.deleteProducts = function(req, res){
    Products.findByIdAndRemove({_id:req.body._id}, function(err, results){
        if(!err){
            res.json(200, {msg:'ok',content:results})
        }else{
            res.json(404, {msg:err})
        }
    })
}

//update
exports.updateProductdir = function(req, res){
    var updateParameter = req.body.ups ? req.body.ups : {$set:req.body.update}
    Productdir.findOneAndUpdate({_id:req.body._id},updateParameter,function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}
exports.updateProducts = function(req, res){
    var updateParameter = req.body.ups ? req.body.ups : {$set:req.body.update}
    Products.findOneAndUpdate({_id:req.body._id},updateParameter,function(err, result){
        if(err){
            res.json(404, {msg:'No Content'})
        }else{
            res.json(result)
        }
    })
}