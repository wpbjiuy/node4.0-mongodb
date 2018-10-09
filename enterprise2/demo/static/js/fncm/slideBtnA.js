function fnSlideBtnA(startMaxNum,dom){
	var slide_box_a = dom ? dom.find('.slide_box_a') : $('.slide_box_a');
	var sw = slide_box_a.parent().width()-slide_box_a.next().width()-slide_box_a.prev().width()-20;
	slide_box_a.width(sw);
	var slide_box_a_bg = slide_box_a.find(".slide_bg"); //启动服务滑动层
	var slide_box_aBtn = slide_box_a.find(".slide_btn");  //启动服务滑动按钮
	var tknum = slide_box_a.nextAll(".tknum");   	//启动服务数量
	var num1 = startMaxNum ? startMaxNum : 100;  //启动服务最大数量
	var slide_w = slide_box_a.width()-10;  //滑动的范围
	var vnum1 = num1/slide_w;  //拖动距离与实际显示数量的比例
	var num_e = 0;  //启动服务滑动距离
	var num_e1 = 0;
	var tkOneFalse = $("#tkOneFalse");    //是否启动一个实例勾选
	var sbcFalse = false;  //是否启动一个实例判断条件

	/*--勾选启动一个实例--*/
	tkOneFalse.change(function(){
		if($(this).get(0).checked){
			sbcFalse = true;
			tknum.attr('disabled','disabled');
			slide_box_aBtn.addClass('disabled');
			tknum.val(1);
			slide_box_aBtn.stop().animate({left:1/vnum1 + 'px'},400,function(){
				num_e = parseInt(slide_box_aBtn.css('left'));
			})
		}else{
			sbcFalse = false;
			tknum.removeAttr('disabled');
			slide_box_aBtn.removeClass('disabled');
		}
	});

	/*--启动滑动按钮取值--*/
	slide_box_aBtn.mousedown(function(e){
		var ths = $(this);
		if(!sbcFalse){
			num_e1 = e.clientX;
			$(window).bind('mousemove',function(ev){
				var sle = ev.clientX - num_e1;
				var slenum = (num_e+sle) < 0 ? 0 : (num_e+sle);
				var slev = Math.round(slenum * vnum1);
				if(slev <= 100){
					ths.parent().next().val(slev);
					ths.css('left',slenum+'px');
				}
			})
		}
		
	})
	$(window).mouseup(function(e){
		num_e = parseInt(slide_box_aBtn.css('left'));
		$(this).unbind('mousemove');
	})
	tknum.keydown(function(){
		setTimeout(function(){
			var thsVal = parseInt(tknum.val());
			thknumValso($(this),thsVal);
		},10)
	})
	tknum.change(function(){
		var thsVal = parseInt(tknum.val());
		thknumValso($(this),thsVal);
	})
	function thknumValso(ths,v){
		var slideBtn = ths.prev().find('.slide_btn');
		ths.val(v);
		if(!v || v < 0){
			v = 0;
			ths.val(0);
		}else if(v >= num1){
			v = num1;
			ths.val(num1);
		}
		slideBtn.stop().animate({left:v/vnum1 + 'px'},400,function(){
			num_e = parseInt(slideBtn.css('left'));
		})
	}
	//点击滑动层获取数量
	slide_box_a_bg.click(function(e){
		if(!sbcFalse){
			var thsVal = Math.round(e.offsetX*vnum1);
			var slideBtn = $(this).next();
			var zTknum = $(this).parent().next();
			zTknum.val(thsVal);
			if(!thsVal || thsVal < 0){
				thsVal = 0;
				zTknum.val(0);
			}else if(thsVal > num1){
				thsVal = num1;
				zTknum.val(num1);
			}
			slideBtn.stop().animate({left:thsVal/vnum1 + 'px'},400,function(){
				num_e = parseInt(slideBtn.css('left'));
			})
		}	
	})
	thknumValso(tknum,parseInt(tknum.val()))
}