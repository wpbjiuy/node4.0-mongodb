(function($, wd){
  var leftnav = $('.leftnav')
  var details = $('.zdetails')
  var id = route.search.id

  $.get('/get/filedir',function(data, status, xhr){
    if(data){console.log(data)
      getFile(data[0]._id)
    }
  })

  function getFile(dirid){
    $.get('/get/file',{id:dirid},function(data, status, xhr){
      if(!data) return;
      if(!id){
        id = data[0]._id
      }
      $.each(data,function(i, item){
        leftnav.append('<li><a class="'+(id==item._id?'on':'')+'" href="#/about?id='+item._id+'">'+item.name+'</a></li>')
        if(id==item._id) addCc(item);
      })
    })
  }

  function addCc(data){
    details.html(data.details)
  }

})(jQuery, window)