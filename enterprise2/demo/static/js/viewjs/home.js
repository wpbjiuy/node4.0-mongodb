(function($,wd){
  var slide = $(".slide")
  var ck_a=$(".slide .hd a")
  var sd_ul=$(".slide .slide_cc ul")
  var sd_li=$(".slide .slide_cc ul li")
  var hd = $('.slide .hd a')
  sd_li.width(slide.width())
  sd_li.find('img').height(slide.height())
  var sd_sw=sd_li.width()
  var sd_false=false
  var sd_num=0, sd_li_length=sd_li.length, seTime=800, soTime=2000;

  for(var i=0;i<sd_li_length;i++){
    $(".sd_nav ul").append("<li></li>")
  }
  var sd_nav_li=$(".sd_nav li")
  var sd_nav_w=(sd_nav_li.width()+parseInt(sd_nav_li.css("marginLeft"))*2)*sd_li_length

  hd.css({
    height:slide.height()+'px',
    lineHeight:slide.height()+'px'
  })

  $(wd).resize(function(){
    $(".slide .slide_cc ul li").width(slide.width())
    sd_sw = sd_li.width()
    sd_li.find('img').height(slide.height())
    hd.css({
      height:slide.height()+'px',
      lineHeight:slide.height()+'px'
    })
  })

  sd_nav_li.eq(0).addClass("on")
  $(".sd_nav").css({"width":sd_nav_w+"px","marginLeft":-sd_nav_w/2+"px"})
  sd_ul.css("width",sd_sw*(sd_li_length+1)+"px")

  ck_a.click(function(){
    sd_li=$(".slide .slide_cc ul li")
    if($(this).index()==0){
      if(sd_false==false){
        sd_false=true
        LeftList(sd_li,0)
      }else{
        sd_li.eq(0).remove()
        LeftList(sd_li,1)
      }
      if(sd_num<sd_li_length-1){
        sd_num++
      }else{
        sd_num=0
      }
    }else{
      sd_ul.prepend('<li style="width:'+sd_sw+'px">'+sd_li.eq(sd_li_length-1).html()+'</li>').css("left",-sd_sw+"px")
      sd_ul.stop().animate({left:'0px'},seTime)
      sd_li.eq(sd_li.length-1).remove()
      if(sd_num>0){
        sd_num--
      }else{
        sd_num=sd_li_length-1;
      }
    }
    sd_nav_li.eq(sd_num).addClass("on").siblings().removeClass("on")
  })

  //自动滑动
  var autoSlide=setInterval(function(){
          ck_a.eq(0).trigger("click")
        },soTime)
  ck_a.hover(function(){
    clearInterval(autoSlide)
  },function(){
    autoSlide=setInterval(function(){
          ck_a.eq(0).trigger("click")
        },soTime)
  })

  //小圆点序号滑动
  sd_nav_li.hover(function(){
    sd_li=$(".slide .slide_cc ul li")
    clearInterval(autoSlide)
    var znum=$(this).index()-$(".sd_nav li.on").index()

    if(znum>0){
      if(sd_false==false){
        sd_false=true
        LeftList_1(sd_li,znum,znum)
      }else{
        sd_li.eq(sd_li_length).remove()
        for(var i=0;i<znum;i++){
          sd_li.eq(i).remove()
        }
        LeftList_1(sd_li,znum+1,znum)
      }
    }else if(znum<0){
      if(sd_false==true){
        var i=0
        while(i<sd_li.length-sd_li_length){
          sd_li.eq(i).remove()
          i++ 
        }
        sd_false=false
      }
      znum=Math.abs(znum)
      for(var i=0;i<znum;i++){
        sd_ul.prepend('<li style="width:'+sd_sw+'px">'+sd_li.eq(sd_li.length-1-i).html()+'</li>')
        sd_li.eq(sd_li.length-1-i).remove()
      }
      sd_ul.css("left",-sd_sw*znum+"px")
      sd_ul.stop().animate({left:'0px'},seTime)
    }
    $(this).addClass("on").siblings().removeClass("on")
    sd_num=$(this).index()
  },function(){
    autoSlide=setInterval(function(){
          ck_a.eq(0).trigger("click")
        },soTime)
  })

  function LeftList(demo,n){
    sd_ul.append('<li style="width:'+sd_sw+'px">'+demo.eq(n).html()+'</li>').css("left","0px")
    sd_ul.stop().animate({left:-sd_sw+'px'},seTime,function(){
      sd_ul.css("left","0px")
      demo.eq(n).remove()
      sd_false=false
    })
  }

  function LeftList_1(demo,n,m){
    for(var i=0;i<n;i++){
      sd_ul.append('<li>'+demo.eq(i).html()+'</li>')
    }
    sd_ul.css("left","0px")
    sd_ul.stop().animate({left:-sd_sw*m+'px'},seTime,function(){
      sd_ul.css("left","0px")
      for(var i=0;i<n;i++){
        demo.eq(i).remove()
      }
      sd_false=false
    })
  }
  
})(jQuery, window)