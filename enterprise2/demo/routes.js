var crypto = require('crypto')
var express = require('express')
module.exports = function(app){
    var file = require('./controllers/file_controller.js')
    var news = require('./controllers/news_controller.js')
    var product = require('./controllers/product_controller.js')
    var img = require('./controllers/img_controller.js')
    var fsImg = require('./controllers/fsImg_controller.js')
    var user = require('./controllers/user_controller.js')

    app.use('/static', express.static('./static')).
        use('/images', express.static('../images')).
        use('/lib', express.static('../lib'))
    app.get('/', function (req, res){
        res.render('index')
    })
    app.get('/main', function (req, res) {
        if(req.session.user){
            res.render('main', {username: req.session.username, msg:req.session.msg})
        }else{
            req.session.msg = 'Access denied!'
            res.redirect('/login')
        }
    })
    app.get('/login', function (req, res) {
        if(req.session.user){
            res.redirect('/main')
        }
        res.render('login')
    })
    app.get('/logout', function (req, res) {
       req.session.destroy(function () {
           res.redirect('/login')
       })
    })

    function isLogin(req, res, fn, type){
        if(req.session.user){
            fn(req, res)
        }else{
            req.session.msg = 'Access denied!'
            res.json(404, {isLogin:'no',msg:'您没有登陆'})
        }
    }
    app.post('/post/login', user.login)

    app.get('/get/newsdir', news.getNewsdir)
    app.get('/get/news', news.getNews)
    app.get('/get/newsone', news.getNewsDedails)
    app.get('/get/filedir', file.getFiledir)
    app.get('/get/file', file.getFile)
    app.get('/get/productdir', product.getProductdir)
    app.get('/get/products', product.getProducts)
    app.get('/get/product', product.getProduct)
    app.get('/get/imagesdir', img.getImgdir)
    app.get('/get/images', img.getImg)
    app.get('/get/user', function(req, res){isLogin(req, res, user.getUser)})

    app.post('/create/newsdir', function(req, res){isLogin(req, res, news.createNewsdir)})
    app.post('/create/news', function(req, res){isLogin(req, res, news.createNews)})
    app.post('/create/filedir', function(req, res){isLogin(req, res, file.createFiledir)})
    app.post('/create/file', function(req, res){isLogin(req, res, file.createFile)})
    app.post('/create/productdir', function(req, res){isLogin(req, res, product.createProductdir)})
    app.post('/create/products', function(req, res){isLogin(req, res, product.createProducts)})
    app.post('/create/imagesdir', function(req, res){isLogin(req, res, img.createImgdir)})
    app.post('/create/images', function(req, res){isLogin(req, res, img.createImg)})
    app.post('/create/user', function(req, res){isLogin(req, res, user.createUser)})

    app.post('/delete/newsdir', function(req, res){isLogin(req, res, news.deleteNewsdir)})
    app.post('/delete/news', function(req, res){isLogin(req, res, news.deleteNews)})
    app.post('/delete/filedir', function(req, res){isLogin(req, res, file.deleteFiledir)})
    app.post('/delete/file', function(req, res){isLogin(req, res, file.deleteFile)})
    app.post('/delete/productdir', function(req, res){isLogin(req, res, product.deleteProductdir)})
    app.post('/delete/products', function(req, res){isLogin(req, res, product.deleteProducts)})
    app.post('/delete/imagesdir', function(req, res){isLogin(req, res, img.deleteImgdir)})
    app.post('/delete/images', function(req, res){isLogin(req, res, img.deleteImg)})
    app.post('/delete/user', function(req, res){isLogin(req, res, user.deleteUser)})

    app.post('/update/newsdir', function(req, res){isLogin(req, res, news.updateNewsdir)})
    app.post('/update/news', function(req, res){isLogin(req, res, news.updateNews)})
    app.post('/update/filedir', function(req, res){isLogin(req, res, file.updateFiledir)})
    app.post('/update/file', function(req, res){isLogin(req, res, file.updateFile)})
    app.post('/update/productdir', function(req, res){isLogin(req, res, product.updateProductdir)})
    app.post('/update/products', function(req, res){isLogin(req, res, product.updateProducts)})
    app.post('/update/imagesdir', function(req, res){isLogin(req, res, img.updateImgdir)})
    app.post('/update/user', function(req, res){isLogin(req, res, user.updateUser)})

    //upload images
    app.post('/fs/fsupload', function(req, res){isLogin(req, res, fsImg.fsupload)})
    app.post('/fs/fsdelete', function(req, res){isLogin(req, res, fsImg.fsdelete)})

}