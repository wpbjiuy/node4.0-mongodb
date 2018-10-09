var fileBox = document.getElementById("file_box");
var fileInput = document.getElementById("file_input");
var images = document.getElementById("images");
fileInput.onchange = function (){
    var pEle = document.createElement("span");
    pEle.className = 'itCsle imgBox';
    var csle = document.createElement("div");
    csle.className = 'csle'
    var remove = document.createElement("span");
    remove.className = 'delete'
    var i = document.createElement("i");
    i.className = 'icon-cancel-circle';

    remove.appendChild(i)
    csle.appendChild(remove)
    pEle.appendChild(csle)

    var imgEle = document.createElement("img");
    var fileValue = this.value;
    var fileSize = 0;
    var imgSrc = "";

    remove.onclick = function(){
        removeImg($(this))
    }

    if (!/(.gif|png|jpeg|jpg)$/.test(fileValue)){
        alert("图片类型必须是.gif、.png、.jpeg、jpg中的一种");
        return false;
    } else {
        //判断是不是IE浏览器
        if ((navigator.userAgent.indexOf("MSIE") >= 0) && (navigator.userAgent.indexOf("Opera") < 0)){
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(fileValue);
            fileSize = file.size;
            imgSrc = fileInput.value;
        } else {
            imgSrc = window.URL.createObjectURL(fileInput.files[0]);
            fileSize = fileInput.files[0].size;
        }
        fileSize = (Math.round(fileSize * 100 / 1024) / 100);
        if (fileSize > 15000){
            alert("图片不能大于15000K");
            return false;
        }
        // 以下三行必须在setTimeout()前面，要么，获取不到宽度和高度。
        imgEle.src = imgSrc;
        pEle.appendChild(imgEle);
        images.appendChild(pEle);
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
};

function removeImg(ths){console.log(ths)
    var imgDom = ths.parents('.imgBox')
    var dataPath = imgDom.find('img').attr('data-path')
    //fnFsdelete(dataPath,imgDom)
    imgDom.remove()
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
var imagefile = $('#imagefile')
function fnFsupload(data){
    $.ajax({
        url: '/fs/fsupload?isOtherImg=true&imgPath=other',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false, //不可缺参数
        processData: false, //不可缺参数
        beforeSend: function(xhr){

        },
        success: function(data) {
            console.log(data);
            var imgtxt = imagefile.val()?imagefile.val()+',':''
            imagefile.val(imgtxt+data.msg)
            $("#images").find('img:last').attr('data-path','..'+data.msg)
        },
        error: function(data) {
            console.log('error');
        },
        complete: function(xhr, ts){
            
        }
    });
}
function fnFsdelete(dataPath,removeDom){
    $.ajax({
        url: '/fs/fsdelete',
        type: 'POST',
        data: {path:dataPath},
        success: function(data) {
            console.log(data);
            removeDom.remove()
        },
        error: function() {
            console.log('error');
        }
    });
}
