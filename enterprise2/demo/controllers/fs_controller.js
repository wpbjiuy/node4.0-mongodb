var formidable = require('formidable');
var mongoose = require('mongoose'),
    Imgdir = mongoose.model('Imgdir'),
    Img = mongoose.model('Img')
var fs = require('fs');
var cacheFolder = '../images/upload/';
var UPLOAD_FOLDER = '/images/upload/';
exports.fsupload = function(req, res) {
    //var currentUser = req.session.user;  //上传到以用户ID为目录的文件夹下
    var currentUser = {name:'jiuy',id:'user_jiuy'};
    var userDirPath = cacheFolder+ (req.query.imgPath || currentUser.id || 'timg');
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;

    var displayUrl;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(404,{msg:err});
            return;
        }
        var extName = ''; //后缀名
        var _files = files.upload || files
        
        if(_files && _files.type){
            switch (_files.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }
        }
        
        if (extName.length === 0) {
            res.json(202,{msg:'只支持png和jpg格式图片'});
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            var imgPath = req.query.imgPath || currentUser.id || 'timg';

            displayUrl = UPLOAD_FOLDER + imgPath + avatarName;
            fs.renameSync(_files.path, newPath); //重命名

            Imgdir.findOne({name:'其它图片'})
                .exec(function(err, result){
                    if(result){console.log(result)
                        createImg({
                            cId:result._id,
                            path:displayUrl
                        })
                    }else{
                        createImgDir({
                            name:'其它图片',
                            describe:'这里一般是编辑文本框上传的图片'
                        },function(id){
                            createImg({
                                cId:id,
                                path:displayUrl
                            })
                        })
                    }
                })
            

            res.json(201,{msg:displayUrl});
        }
    });
};

exports.fsdelete = function(req, res){
    fs.unlink(req.body.path, function(err){
        if(err)
            res.json(404,{msg:err})
        else
            res.json(200,{msg:'文件删除成功'})
    })
}

//创建图片目录
function createImgDir(data,callback) {
    var newFrildir = new Imgdir(data)
    newFrildir.save(function(err, results){
        if(!err){
            callback(results._id)
        }else{
            console.log(err)
        }
    })
}

//创建图片数据
function createImg(data) {
    var newFril = new Img(data)
    newFril.save(function(err, results){
        if(!err){
            console.log(err)
        }
    })
}