var loadingNum = 0
$.ajaxSetup({
	beforeSend:function(xhr, opt){
		loadingNum++;
		if(!$('#header .loadingf').length){
			$('#header').append('<p class="loadingf"></p>')
			$('#header .loadingf').animate({width:'90%'},5000)
		}else{
			$('#header .loadingf').stop().animate({width:'90%'},5000)
		}
	},
	complete:function(xhr, opt){
		if(xhr.responseJSON && xhr.responseJSON.isLogin == 'no'){
			location.href = '/login'
		}
		loadingNum--;
		if(!loadingNum){
			$('#header .loadingf').stop().animate({width:'100%'},100,function(){
				$(this).remove()
			})
		}
	}
})