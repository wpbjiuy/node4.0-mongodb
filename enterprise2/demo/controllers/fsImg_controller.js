var formidable = require('formidable');
var mongoose = require('mongoose'),
    Imgdir = mongoose.model('Imgdir'),
    Img = mongoose.model('Img')
var fs = require('fs');
var cacheFolder = '../images/upload/';
var UPLOAD_FOLDER = '/images/upload/';
exports.fsupload = function(req, res) {
    var currentUserName = req.session.username;  //上传到以用户名称为目录的文件夹下
    var userDirPath = cacheFolder+ (req.query.imgPath || currentUserName || 'timg');
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    var maxSize = 2 * 1024 * 1024;
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = null;
    form.keepExtensions = true;
    var isOtherImg = req.query.isOtherImg

    form.on('error', function(message) {
        if(message)
        {
            res.json({err: message});
        }
        else
        {
            res.json({err: 'Upload error, please try again'});
        }
    });

    form.on('fileBegin', function(name, file){
        if(form.bytesExpected > maxSize)
        {   
            this.emit('error', '图片大小不能超过2MB。');
        }
    });

    form.on('file', function(name, file) {
        var type = file.type;
        type = type.split('/');
        type = type[1];
        
        if(type != 'jpeg' && type != 'png' && type != 'gif')
        {   
            this.emit('error', "图片格式不是 JPG, PNG, GIF。");
            fs.unlink(file.path);
        } else if(file.size < maxSize)
        {
            var avatarName = '/' + Date.now() + '.' + type;
            var newPath = form.uploadDir + avatarName;
            var imgPath = req.query.imgPath || currentUserName || 'timg';

            var _displayUrl = UPLOAD_FOLDER + imgPath + avatarName;

            fs.rename(file.path, newPath);
            
            if(isOtherImg){
               addOtherImg(_displayUrl)
            }

            res.json(201,{msg:_displayUrl});
        }
        else
        {   console.log(file.size)
            // this.emit('error', '未知错误！');
            fs.unlink(file.path);
        }
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        // console.log(bytesReceived); //This is just to view progress
    });

    form.parse(req);

    // upload(form, req, res, currentUserName)
};

function upload(form, req, res, currentUserName){
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(404,{msg:err});
            return;
        }
        var extName = ''; //后缀名
        var displayUrl;
        var _files = (function(files){
            var f = []
            for(var d in files){
                f.push(files[d])
            }
            return f
        })(files)
        
        if(!_files.length){
            res.json(404,{msg:err});
            return;
        }
        
        if(_files.length > 1){
            displayUrl = []
            for (var i = 0; i < _files.length; i++) {
                extName = isTypeImg(_files[i])
                if(extName){
                    displayUrl.push(addImg(_files[i],extName))
                }
            }

            if(displayUrl.length)
                res.json(201,{msg:displayUrl});
            else
                res.json(202,{msg:'只支持png和jpg格式图片！'});
        }else{
            
            extName = isTypeImg(_files[0])
            
            if (extName.length === 0) {
                res.json(202,{msg:'只支持png和jpg格式图片！'});
                return;
            } else {
                displayUrl = addImg(_files[0], extName)
                if(isOtherImg){
                   addOtherImg(displayUrl)
                }
                res.json(201,{msg:displayUrl});
            }
        }

        function addImg(file,extName){
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            var imgPath = req.query.imgPath || currentUserName || 'timg';

            var _displayUrl = UPLOAD_FOLDER + imgPath + avatarName;
            fs.renameSync(file.path, newPath); //重命名

            return _displayUrl
        }
    });
}

function isTypeImg(file){
    var result = false
    if(file && file.type){
        switch (file.type) {
            case 'image/pjpeg':
                result = 'jpg';
                break;
            case 'image/jpeg':
                result = 'jpg';
                break;
            case 'image/png':
                result = 'png';
                break;
            case 'image/x-png':
                result = 'png';
                break;
        }
    }

    return result
}

function addOtherImg(displayUrl){
    Imgdir.findOne({name:'其它图片'})
        .exec(function(err, result){
            if(result){
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