(function($, wd){
  var leftnav = $('.leftnav')
  var cclist = $('.cclist')
  var id = route.search.id
  var thsDatas = []
  
  id & getNews(id)

  $.get('/get/newsdir',function(data, status, xhr){
    if(data){
      if(!id){
        getNews(data[0]._id), id = data[0]._id
      }
      $.each(data,function(i, item){
        leftnav.append('<li><a class="'+(id==item._id?'on':'')+'" href="#/news?id='+item._id+'">'+item.name+'</a></li>')
      })
    }
  })

  route.getserch = function(serchObj){
    serchObj.id & getNews(serchObj.id)
  }

  function getNews(id){
    cclist.children().remove()
    $.get('/get/news',{id:id},function(data,status,xhr){
      if(data && data.length) addList(data);
    })
  }

  function addList(data){
    thsDatas = data
    $.each(data,function(i,item){
      cclist.append('<li>'+
          '<div class="fl imgbox"><a href="javascript:void(0);"><img src="'+item.thumbnail+'" /></a></div>'+
          '<div class="fl infos">'+
            '<h3 class="ttl"><a href="javascript:void(0);">'+item.title+'</a><small class="time">'+(new Date(item.releaseTime)).toLocaleString()+'</small></h3>'+
            '<p class="cc">'+item.brief.slice(0,150)+(item.brief.length > 150 ? '...':'')+'</p>'+
          '</div>'+
        '</li>')
      cclist.on('click','li:last a',function(e){showDetails(i)})
    })
  }

  function showDetails(i){
    var showHtml = '<div class="details">'+
                      '<h2 class="ttl">'+thsDatas[i].title+'<h2>'+
                      '<p class="time">'+thsDatas[i].releaseTime+'</p>'+
                      '<div class="cc">'+thsDatas[i].details+'<div>'+
                    '</div>'
    showFixedInfo(showHtml)
  }

})(jQuery, window)