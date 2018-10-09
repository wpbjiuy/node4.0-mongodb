var mianObj = {}
mianObj.showMainScroll = null

route.navOnGist = [
    ['content'],
    ['product'],
    ['news'],
    ['img'],
    ['user']
]

route.cfg('home',{
    url:'/static/mviews/home.html',
    script:'/static/js/mviewjs/home.js',
}).cfg('content', {
    url:'/static/mviews/content.html',
    script:'/static/js/mviewjs/content.js',
    cbk:function(search){
        route.search = search.searchToObj()
    }
}).cfg('product', {
    url:'/static/mviews/product.html',
    script:'/static/js/mviewjs/product.js',
    cbk:function(search){
        route.search = search.searchToObj()
    }
}).cfg('news', {
    url:'/static/mviews/news.html',
    script:'/static/js/mviewjs/news.js',
    cbk:function(search){
        route.search = search.searchToObj()
    }
}).cfg('img', {
    url:'/static/mviews/img.html',
    script:'/static/js/mviewjs/img.js',
    cbk:function(search){
        route.search = search.searchToObj()
    }
}).cfg('user', {
    url:'/static/mviews/user.html',
    script:'/static/js/mviewjs/user.js',
    cbk:function(search){
        route.search = search.searchToObj()
    }
}).otherCfg('home').run();


var showTbthSlcHtml,showTbThSlcData;

function setShowTbthSlcHtml(data){
    showTbThSlcData = data;
    var result = '<div class="slcBoxMain">';

    for (var i = 0; i < data.length; i++) {
        result += '<span class="btn-a" data-path="'+i+'">'+data[i].txt+'</span>';
    }
    result += '</div>';
    result += '<div class="etxt sbmBox">'+
                '<span class="btn-info sbm">提交</span>'+
                '<span class="btn-warning cancel">取消</span>'+
            '</div>'+
            '<p class="hint">注：此选择方式跟window桌面应用选择雷同！按住Shift键进行连续选择！</p>';

    return result
}

function setShowTb(){
    cm.fnInfo('oc').show('<h2 class="ttl">选择需要显示的字段</h2>'+showTbthSlcHtml,function(fixedMian){
        var _offset = fixedMian.offset()
        slck.run(fixedMian[0],{
            zTop:_offset.top,
            zLeft:_offset.left,
            skCss:'skCss',
            slcOpt:'.btn-a',
            scrollDoms:[fixedMian[0]],
            notRemoveDom:fixedMian.find('.sbm')[0]
        })

    }).sbm(function(data,fixedEye){
        var showTh = []
        fixedEye.find('.skCss').each(function(i,item){
            var n = parseInt($(this).attr('data-path'))
            showTh.push(showTbThSlcData[n])
        })
        
        if(window.showTmain && showTh.length){
            window.showTmain.resetShow(showTh)
        }
        
    })
}

mianObj.ckUpload = function(){
    this.uploading = $('<div class="fixed uploading"><p>正在努力打开文件夹<span class="loado">.</span></p></div>')
    $('body').append(this.uploading)
    this.loado(this.uploading)
    
}
mianObj.loado = function(dom){
    this.infload = setTimeout(function(){
        if(dom && dom.length){
            var loadoDom = dom.find('.loado'), t = loadoDom.text()
            if(t.length < 6){
                loadoDom.text(t+'.')
            }else{
                loadoDom.text('.')
            }
            mianObj.loado(dom)
        }
    },400)
}
mianObj.removeLoad = function(){
    this.uploading.remove()
    clearTimeout(this.infolad)
}

var slcImgObj = {
    imgDirUrl: '/imagesdir',
    imgsUrl: '/images'
}

slcImgObj.createImg = function (imgDir,callback){
    var _self = this
    var thsDir = imgDir.id ? imgDir : _self.ona
    console.log(thsDir)
    cm.fnInfo('edit').show({
        showHtml:createImgHtml,
        isEditor:true,
        cls:[
            {
                dom:'#uploadImg',
                event:'change',
                fn:slcImgObj.showZImg
            },
            {
                dom:'#uploadImg',
                event:'focus',
                fn:slcImgObj.focus
            },
            {
                dom:'#uploadImg',
                event:'blur',
                fn:slcImgObj.blur
            },
            {
                dom:'.inputfileBox',
                event:'click',
                fn:function(){
                    mianObj.ckUpload()
                }
            }
        ]
    }).sbm(function(data, fdom){
        cm.uploadImg(fdom.find('#uploadImg'),'/fs/fsupload',function(data){
            if(data){
                $.post('/create/images', {cId:thsDir.id,path:data.msg}, function(data, status, xhr){
                    if(xhr.status == 201){
                        if(callback){
                            callback(data)
                            return;
                        }
                        var li = $('<li class="imgBox"><img src="'+data.content.path+'" /></li>')
                        _self.addImgDom.append(li)
                    }
                })
            }
        })
    })
}

slcImgObj.focus = function(){
    // console.log('focus')
}

slcImgObj.blur = function(){
    mianObj.removeLoad()
}

slcImgObj.showZImg = function(){
    var ths = $(this)
    var imgBox = ths.parents('.inputfileBox:first').next()
    cm.addImg(ths, imgBox) 
}

slcImgObj.slcImgs = function (e,addImgDom){
    var ths = $(this)
    cm.fnInfo('oc').show({
        showHtml:slcImgHtml,
        isEditor:true
    },function(fdom){

        var imgdir = slcImgObj.showImgDir(fdom)
        fdom.find('.addImg').on('click',$.proxy(slcImgObj.createImg,imgdir))

    }).sbm(function(data,fdom){

        var imgs = []
        ths.next('.imgBox').children().remove()
        fdom.find('.imgBox img.slced').each(function(i,item){
            var thsSrc = $(this).attr('src')
            imgs.push(thsSrc)
            ths.next('.imgBox').append('<img src="'+thsSrc+'" />')
        })
        if(addImgDom){
            addImgDom.val(imgs)
        }else{
            ths.next().next().val(imgs)
        } 
    })
}

slcImgObj.showImgDir = function (fdom){
    var imgDirData = []
    var imgdir = cm.fnDirList({
        get:{
            url:'get'+this.imgDirUrl,
        },
        nottl:true,
        css:'slcLists',
        dirName:'name',
        addDom:fdom.find('.imgdir')
    },function(data,dirUl){
        imgDirData = data

    }).click(function(ths, id){
        slcImgObj.showImgs(fdom, fdom.find('.imgs'), id)
    });

    imgdir.addImgDom = fdom.find('.imgs')

    return imgdir;
}

slcImgObj.showImgs = function (fdom, addDom,id){
    addDom.children().remove()
    $.get('get'+this.imgsUrl,{id:id},function(data, status, xhr){
        if(xhr.status == 200){
            slcImgObj.addImgs(fdom, addDom,data.data)
        }
    })
}

slcImgObj.addImgs = function (fdom, addDom, data){
    $.each(data, function(i, item){
        var li = $('<li class="imgBox"><img src="'+item.path+'" /></li>')
        addDom.append(li)
    })

    var _offset = fdom.offset()
    slck.run(fdom[0],{
      zTop:_offset.top,
      zLeft:_offset.left,
      skCss:'slced',
      slcOpt:'.imgBox img',
      scrollDoms:[fdom[0]],
      notRemoveDom:fdom.find('.sbm')[0]
  })
}