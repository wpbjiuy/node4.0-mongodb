(function($,wd){
  var ttlDom = $('.details .ttl')
  var timeDom = $('.details .time')
  var ccDom = $('.details .cc')
  var id = route.search.id

  $.get('/get/newsone',{id:id},function(data,status,xhr){
    if(data){
      ttlDom.text(data.title)
      timeDom.text(new Date(data.releaseTime).toLocaleString())
      ccDom.html(data.details)
    }
  })

})(jQuery,window)