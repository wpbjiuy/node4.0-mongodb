(function($,wd){
	var leftnav = $('.leftnav')
	var imgs = $('#imgs')
	var brief = $('#brief')
	var infos = $('#productinfos')
	var thumblist = $('#thumblist')
	var id = route.search.id
	getProdut(id)

	$.get('/get/productsdir',function(data, status, xhr){
    if(data){
      $.each(data,function(i, item){
        leftnav.append('<li><a class="'+(id==item._id?'on':'')+'" href="#/product?id='+item._id+'">'+item.name+'</a></li>')
      })
    }
  })

	function getProdut(id){
		$.get('/get/product',{id:id},function(data,status,xhr){
			if(data){
				addCc(data)
			}
		})
	}

	function addCc(data){
		if(data.imagefile && data.imagefile.length) addImgs(data.imagefile);
		brief.find('h3.ttl').text(data.name)
		brief.find('.describe').html(data.describe)
		infos.find('.cc').html(data.details)
	}

	function addImgs(imgsData){
		imgs.find('.tb-booth img').attr('src',imgsData[0])
		for (var i = 0; i < imgsData.length; i++) {
			thumblist.append('<li class="'+(i==0?'tb-selected':'')+'">'+
					'<div class="tb-pic tb-s40">'+
					'<a href="javascript:void(0);"><img src="'+imgsData[i]+'" mid="'+imgsData[i]+'" big="'+imgsData[i]+'"></a>'+
				'</div></li>')
		}

		fnImagezoom()
	}

	function fnImagezoom(){
		$(".jqzoom").imagezoom();

		$("#thumblist li a").click(function(){

			$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");

			$(".jqzoom").attr('src',$(this).find("img").attr("mid"));

			$(".jqzoom").attr('rel',$(this).find("img").attr("big"));

		});
	}
})(jQuery,window)