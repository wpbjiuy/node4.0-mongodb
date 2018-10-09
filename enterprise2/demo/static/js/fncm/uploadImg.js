var fileBox = document.getElementById("file_box");
var fileInput = document.getElementById("file_input");
var images = document.getElementById("images");

function addImg(fileInput,imgBox){
    fileInput.change(function(){console.log(this)
        var fileValue = $(this).val();
        var fileSize = 0;
        var imgSrc = "";

        if (!/(.gif|png|jpeg|jpg)$/.test(fileValue)){
            alert("图片类型必须是.gif、.png、.jpeg、jpg中的一种");
            return false;
        } else {
            //判断是不是IE浏览器
            if ((navigator.userAgent.indexOf("MSIE") >= 0) && (navigator.userAgent.indexOf("Opera") < 0)){
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                var file = fileSystem.GetFile(fileValue);
                fileSize = file.size;
                imgSrc = fileInput.val();
            } else {
                imgSrc = window.URL.createObjectURL(this.files[0]);
                fileSize = this.files[0].size;
            }
            fileSize = (Math.round(fileSize * 100 / 1024) / 100);
            if (fileSize > 15000){
                alert("图片不能大于15000K");
                return false;
            }
            // 以下三行必须在setTimeout()前面，要么，获取不到宽度和高度。
            imgBox.html('<img src="'+imgSrc+'"" />')
            //这样做的目的是让程序产生一种等待图片显示后再获取宽度和高度的假象
            // setTimeout(function (){
            //     var imgWidth = imgEle.offsetWidth;
            //     var imgHeight = imgEle.offsetHeight;
            //     if (imgWidth > 512 || imgHeight > 512){
            //         fileBox.removeChild(pEle);
            //         alert("上传的图片的宽和高都不能超过512");
            //         fileBox.blur();
            //         return false;
            //     }
            // }, 10);
        }   
    });
}


function removeImg(ths){console.log(ths)
    var imgDom = ths.parents('.imgBox')
    var dataPath = imgDom.find('img').attr('data-path')
    fnFsdelete(dataPath,imgDom)
}

$("#file_input").change(function(){
    if ($('#file_input').val().length) {
        var fileName = $('#file_input').val();
        var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
        if (extension == ".jpg" || extension == ".png") {
            var fileImgData = new FormData();
            fileImgData.append('upload', $('#file_input')[0].files[0]);
            fnFsupload(fileImgData)
        } 
    }
})

function fnFsupload(path,data,callback){
    $.ajax({
        url: path,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false, //不可缺参数
        processData: false, //不可缺参数
        success: function(data) {
            console.log(data);
            callback(data)
        },
        error: function() {
            console.log('error');
        }
    });
}
function fnFsdelete(dataPath,removeDom){
    console.log(dataPath)
    $.ajax({
        url: '/fs/fsdelete',
        type: 'POST',
        data: {path:dataPath},
        success: function(data) {
            console.log(data);
            if(removeDom) removeDom.remove()
        },
        error: function() {
            console.log('error');
        }
    });
}