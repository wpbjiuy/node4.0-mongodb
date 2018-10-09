var setion = $(".scBox .sced .sction")
var seli = $(".scBox .scon .scli")

setion.click(function(){
	$(this).addClass('on').siblings().removeClass('on')
	seli.eq($(this).index()).show(0).siblings().hide(0)
})