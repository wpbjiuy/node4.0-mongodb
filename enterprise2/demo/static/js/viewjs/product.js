(function($, wd){
  var leftnav = $('.leftnav')
  var proLists = $('#proLists')
  var id = route.search.id

  $.get('/get/productsdir',function(data, status, xhr){
    if(data){
      if(!id){
        getProduct(data[0]._id), id = data[0]._id
      }
      $.each(data,function(i, item){
        leftnav.append('<li><a class="'+(id==item._id?'on':'')+'" href="#/product?id='+item._id+'">'+item.name+'</a></li>')
      })
    }
  })

  getProduct(id)

  route.getserch = function(serchObj){
    getProduct(serchObj.id)
  }

  function getProduct(id){
    proLists.children().remove()
    $.get('/get/products',{id:id},function(data,status,xhr){
      if(data && data.length) addList(data);
    })
  }

  function addList(data){
    $.each(data,function(i,item){
      proLists.append('<li class="list">'+
          '<a class="imgbox" href="#/productdetails?id='+item._id+'"><img src="'+(item.imagefile[0]||'/images/defulte.jpg')+'" /></a>'+
          '<h4 class="name"><a href="#/productdetails?id='+item._id+'">'+item.name+'</a></h4>'+
        '</li>')
    })
  }

})(jQuery, window)