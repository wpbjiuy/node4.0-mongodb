route.navOnGist = [
	['home'],
	['about'],
	['news','newsdetails'],
	['product','productdetails'],
	['contact']
]

route.cfg('home',{
	url:'/static/views/home.html',
	script:'/static/js/viewjs/home.js'
}).cfg('news', {
	url:'/static/views/news.html',
	script:'/static/js/viewjs/news.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).cfg('newsdetails', {
	url:'/static/views/newsDetails.html',
	script:'/static/js/viewjs/newsDetails.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).cfg('about', {
	url:'/static/views/about.html',
	script:'/static/js/viewjs/about.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).cfg('product', {
	url:'/static/views/product.html',
	script:'/static/js/viewjs/product.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).cfg('productdetails', {
	url:'/static/views/productDetails.html',
	script:'/static/js/viewjs/productDetails.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).cfg('contact', {
	url:'/static/views/contact.html',
	script:'/static/js/viewjs/contact.js',
	cbk:function(search){
		route.search = search.searchToObj()
		if(route.getserch) route.getserch(route.search)
	}
}).otherCfg('home').run();


$.get('/get/filedir',function(data, status, xhr){
  if(data){
    getFile(data[0]._id)
  }
})

function getFile(id){
  $.get('/get/file',{id:id},function(data, status, xhr){
    $.each(data,function(i, item){
      $('#nav ul.as li:eq(1) ul').append('<li><a href="#/about?id='+item._id+'">'+item.name+'</a></li>')
    })
  })
}

function showFixedInfo(html){
	var addHtml = '<div id="fixed-info" class="fixed-info">'+
			'<div class="infoBox">'+
				'<a href="javascript:void(0)" class="icon-cross cancel"></a>'+
				html+
			'</div>'+
		'</div>'
	$('body').append(addHtml)
	$('#fixed-info').on('click','.cancel', function(e){
		$('#fixed-info').fadeOut(200,function(){
			$(this).remove()
		})
	})
}