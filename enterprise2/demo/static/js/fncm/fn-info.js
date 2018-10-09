/*--显示按钮下拉框方法--*/
var isSlideUp = true;
function fnShowOptions(dom,callback){
	var btnSelect = !dom ? $(".btnSelect") : dom.find(".btnSelect");
	var btnSelectOptionsA = !dom ? $(".btnSelectOptions a") : dom.find(".btnSelectOptions a");
	var btnSelectOptionCheckbox = !dom ? $(".btnSelectOptions input[type='checkbox']") : dom.find(".btnSelectOptions input[type='checkbox']");
	var seekInput = !dom ? $('.btnSelectBox .seekInput') : dom.find('.btnSelectBox .seekInput');
	var resultTxt = '';
	var isSelected = false;

	btnSelect.unbind('click');
	btnSelect.click(function(){
		if(!$(this).attr('data-isSelect')){
			var ssDom = $(this).siblings('.btnSelectOptions');
			ssDom.find('a').css('display','block')

			$(this).parents('.btnSelectBox').toggleClass('zIndex100');

			if( fnSelectPosition($(this), ssDom.height()) ){  //this function in common.js
				ssDom.css({'top':'100%','bottom':'auto'});
			}else{
				ssDom.css({'top':'auto','bottom':'100%'});
			}

			$(this).find('i.icon-menu3').toggleClass('icon-menu4');
			$(this).find('i.icon-circle-down').toggleClass('icon-circle-up');
			ssDom.stop().slideToggle();
		}
	});

	$(window).unbind('click');
	$(window).click(function(){
		$('.btnSelectOptions:visible').each(function(){
			if($(this).height() > 10 && isSlideUp){
				$(this).slideUp(280,function(){
					$(this).parents('.btnSelectBox').find('i.icon-menu3').removeClass('icon-menu4');
					$(this).parents('.btnSelectBox').find('i.icon-circle-down').removeClass('icon-circle-up');
					$(this).parents('.btnSelectBox').removeClass('zIndex100');
				});	
			}
		})
	})

	//单选赋值
	btnSelectOptionsA.unbind('click');
	btnSelectOptionsA.click(function(){
		if($(this).find('input').index() == -1){
			fnAssResult($(this));
		}
	})
	//多选赋值
	btnSelectOptionCheckbox.parents('.btnSelectOptions').unbind('hover');
	btnSelectOptionCheckbox.parents('.btnSelectOptions').hover(function(){
		isSlideUp = false;
	},function(){
		isSlideUp = true;
	})
	btnSelectOptionCheckbox.unbind('click');
	btnSelectOptionCheckbox.click(function(){
		var resultTo = $(this).parents('.resultBox').find('.result');
		var elmCkb = $(this).parents('.btnSelectOptions').find('input[type="checkbox"]');
		var rltNum = 0;
		var allNum = elmCkb.length;

		if($(this).val() == 'ALL'){
			if(!$(this).get(0).checked){
				elmCkb.each(function(){
					$(this).get(0).checked = false;
				})
			}else{
				elmCkb.each(function(){
					$(this).get(0).checked = true;
				})
			}
		}

		elmCkb.each(function(){
			if($(this).get(0).checked){
				rltNum++;
			}
		});

		if(rltNum){
			if(rltNum == allNum){
				if(elmCkb.eq(0).val() == 'ALL'){ rltNum--; }
				resultTo.text('All('+rltNum+')');
			}else{
				if(elmCkb.eq(0).val() == 'ALL'){
					if(elmCkb.eq(0).get(0).checked){
						elmCkb.eq(0).get(0).checked = false;
						rltNum--;
					}
				}
				resultTo.text('Selected('+rltNum+')');
			}
		}else{
			resultTo.text('none')
		}
	})

	function fnAssResult(ths){
		isSelected = true;
		resultTxt = ths.text();
		var resultTo = ths.parents('.resultBox').find('.result');
		var resultValue = ths.parents('.resultBox').find('.value');

		if(resultTo.index() != -1){
			resultTo.each(function(i,item){
				var ths = $(this);
				if(ths.get(0).tagName == 'INPUT'){
					ths.val(resultTxt);
				}else{
					ths.text(resultTxt);
					if(ths.siblings('input')){
						ths.siblings('input').val(resultTxt);
					}
				}
			})
			
			if(typeof(callback) == 'function'){
				callback(resultTxt)
			}
		}
		if(resultValue.index() != -1){
			resultValue.val(ths.attr('data-value'));
		}
	}

	//查询
	seekInput.keyup(function(e){
		var ths = $(this);
		var thsVal = ths.val().toUpperCase();
		var showFalse = false;
		var ssDom = ths.siblings('.btnSelectOptions');
		isSelected = false;

		ssDom.stop().slideUp();

		ssDom.find('a').each(function(i, item){
			var _ths = $(this)
			var _thsText = _ths.text().toUpperCase()
			if(_thsText.indexOf(thsVal) == -1){
				_ths.parent().css('display','none')
			}else{
				_ths.parent().css('display','block')
				if(!showFalse) showFalse = true
			}
			if(_thsText == thsVal){
				fnAssResult(_ths);
			}
		})

		if(showFalse){

			ths.parents('.btnSelectBox').addClass('zIndex100');

			if( fnSelectPosition(ths.next(), ssDom.height()) ){
				ssDom.css({'top':'100%','bottom':'auto'});
			}else{
				ssDom.css({'top':'auto','bottom':'100%'});
			}

			ssDom.stop().slideDown();
		}
	})

	var seekInputVal = '';
	seekInput.focus(function(){
		btnSelect.click()
		seekInputVal = $(this).val();
	})
	seekInput.blur(function(){
		var ths = $(this);
		var ssDom = ths.siblings('.btnSelectOptions');
		ssDom.stop().slideUp();
		if(ths.val() != seekInputVal && !isSelected){
			ths.val('');
			ths.siblings('input').val('');
		}
	})
}

/*--显示按钮下拉框方法，@功能操作框--*/
function fnBtnShowOperation(dom){
	var btnToShow = dom ? dom.find('.cslShow') : $('.cslShow');
	var showOptions = dom ? dom.find('.cslList') : $('.cslList');

	btnToShow.click(function(){
		var ths = $(this);
		var ctHg = ths.next().height();

		if(fnSelectPosition(ths,ctHg)){
			ths.next().css({'top':'101%','bottom':'auto'})
		}else{
			ths.next().css({'top':'auto','bottom':'101%'})
		}

		ths.next().slideToggle(200,function(){
			$(this).parent().toggleClass('zIndex100');
		})
		ths.toggleClass('cslShows active');
	});

	$(document).click(function(){
		$('.cslList:visible').each(function(){
			var ths = $(this);
			if(ths.height() > 2){
				ths.slideUp(280,function(){
					ths.parent().removeClass('zIndex100');
					ths.prev().removeClass('cslShows active');
				})
			}
		})
	})
}

/*--添加表格输入框方法--*/
function tableInput(dom,tharr,trhtml,explain,thHtml,callback){
	var _table = dom.siblings('table');
	if(!_table.length){
		dom.after('<table class="inputTable"><tr></tr></table>');
		_table = dom.siblings('table');
		if(thHtml){
			_table.find('tr').eq(0).append(thHtml);
		}else if(tharr.length){
			for (var i = 0; i < tharr.length; i++) {
				_table.find('tr').eq(0).append('<th>'+tharr[i]+'</th><th class="tl"></th>')
			}
		}
		_table.append(trhtml);
		if(explain){
			_table.after(explain);
		}
	}else{
		_table.append(trhtml);
	}
	_table.find('.remove').click(function(){
		$(this).parents('tr').remove();
		if(_table.find('tr').length == 1){
			dom.siblings().remove();
		}
		if(callback){
			callback($(this).parents('table'));
		}
	})

	_table.find('select').each(function(){
		var ths = $(this)
		var result = ths.siblings('input.result')
		if(result.index() >= 0){
			ths.change(function(){
				var txt = $(this).context.selectedOptions[0].innerText
				result.val(txt)
			})
		}
	})

	if(_table.find('.btnSelectBox').index() != -1){
		/*--显示按钮下拉框--*/
		var lastTr = _table.find('tr:last'); 
		fnShowOptions(lastTr);  //调用显示按钮下拉框方法
		//lastTr.find('.btnSelectBox').css('zIndex',100-lastTr.index());
	}
}

/*--模糊查询--*/
function fnSeek(obj){
	var seekTxt = $("#seekTxt");  //模糊查询输入框
	var seekBtn = $("#seekBtn");  //模糊查询按钮
	var seekResult = $("#seekResult");  //返回模糊查询
	var seekFalse = false;
	var seekResultLi_length = 0;
	var seekResult_height = 0;
	
	seekTxt.focus(function(){
		if($(this).val()){
			var thisTxt = $(this).val().toUpperCase();
			seekResultData(thisTxt);
		}else{
			if(obj.nullShow){
				seekResultData();
			}
		}
	})
	seekTxt.keyup(function(e){
		if(e.keyCode == 13){
			var focusLi = seekResult.find('li.focus')
			if(focusLi.length){
				focusLi.find('a').click()
			}else{
				seekResultShow();
				return;
			}
		}else if(e.keyCode == 38){
			var focusLi = seekResult.find('li.focus')
			
			if(focusLi.length){
				focusLi.removeClass('focus')

				if(focusLi.index() > 0){
					focusLi.prev().addClass('focus').scrollTo(seekResult,seekResult_height/2,50)
				}else{
					seekResult.find('li:last').addClass('focus').scrollTo(seekResult,seekResult_height/2,50)
				}
			}else{
				seekResult.find('li:last').addClass('focus').scrollTo(seekResult,seekResult_height/2,50)
			}
		}else if(e.keyCode == 40){
			var focusLi = seekResult.find('li.focus')
			if(focusLi.length){
				focusLi.removeClass('focus')

				if(focusLi.index() !=  seekResultLi_length-1){
					focusLi.next().addClass('focus').scrollTo(seekResult,seekResult_height/2,50)
				}else{
					seekResult.find('li:first').addClass('focus').scrollTo(seekResult,seekResult_height/2,50)
				}
			}else{
				seekResult.find('li:first').addClass('focus')
			}
		}else{
			var thisTxt = $(this).val().toUpperCase();
			if(thisTxt){
				seekResultData(thisTxt);
			}else{
				if(obj.nullShow){
					seekResultData();
				}else{
					seekResult.children().remove();
				}
			}
		}
		
	})
	seekTxt.blur(function(){
		if(!seekFalse){
			// seekResult.children().remove();
		}
	})
	seekBtn.hover(function(){
		seekFalse = true;
	},function(){
		seekFalse = false;
	})
	seekBtn.click(function(){
		seekResultShow()
	})
	function seekResultData(argu){
		seekResult.children().remove();
		for (var i = 0; i < obj.seekData.length; i++) {
			for (var j = 0; j < obj.seekData[i].length; j++) {
				if(argu){
					if(obj.seekData[i][j].name.toUpperCase().indexOf(argu) != -1){
						seekResultAppend(i, j)
					}
				}else{
					if(i > 100) break;
					seekResultAppend(i, j)
				}
			}
		}
		seekResultNameClick(seekResult.find('a'));
		seekResult.find('a').hover(function(){
			seekFalse = true;
		},function(){
			seekFalse = false;
		})

		seekResultLi_length = seekResult.find('li').length;
		seekResult_height = seekResult.height()

		function seekResultAppend(i, j){
			if(obj.showElm){
				var apdHtml = obj.showElm(i, j, obj.seekData[i][j].name, obj.seekData[i][j].id);
				seekResult.append(apdHtml);
			}
		}
	}
	function seekResultNameClick(dome){
		dome.click(function(){
			if(obj.rltClk){
				obj.rltClk($(this))
				seekResult.children().remove();
			}
		})
	}
	function seekResultShow(){
		if(obj.rltShow){
			var rltA = seekResult.find('a');
			var sktxt = seekTxt.val();
			obj.rltShow(rltA,sktxt)
			seekResult.children().remove();
		}
	}
}


/*--编辑弹框--*/
var fixed2 = $('.fixed2');
var fixed_edit2 = $(".fixed_edit2");
var fixed_cancel2 = $(".fixed_cancel2");

var z = 0
/*显示编辑框*/
function fnFixed2Show(dHtml,callback,animateCallback){
	fixed_edit2.html(dHtml);
	var editFrom = fixed2.find('.editFrom');
	fixed2.fadeIn(200,function(){
		if(animateCallback){
			editFrom.slideDown(400,animateCallback);
		}else{
			editFrom.slideDown(400);
		}
	});
	fixed2.find('.sbm').click(function(){
		var formData = getInputData(editFrom.find('[data-name]'), 'data-name')
		if($.isEmptyObject(formData)) return

		var isRequired = false
		editFrom.find('[data-required]').each(function(i, itme){
			var ths = $(this)
			if(ths.val() === ''){
				ths.addClass('err')
				ths.focus(function(){
					ths.removeClass('err')
					ths.unbind('focus')
				})
				if(!isRequired) isRequired = true
			}
		})
		if(isRequired) return

		callback(formData,editFrom)
	})
	$('.fixed2 input').focus(function(){
		var ths = $(this);
		ths.bind('keyup', function(e){
			if(e.keyCode == 13){
				ths.blur()
				if(ths.attr('type') != 'button'){
					fixed2.find('.sbm').click()
				}
				ths.unbind('keyup')
			}
		})
	})
	$('.fixed2 input').blur(function() {
		$(this).unbind('keyup')
	})
}
/*关闭编辑框*/
function closeFixed2(){
	fixed2.find('.editFrom').slideUp(280,function(){
		fixed2.fadeOut(200,function(){
			fixed_edit2.children().remove();
		});
	})	
}
fixed_cancel2.click(function(){
	closeFixed2()
});

/*验证输入框是否为空*/
function isRequiredInput(fomDom){
	var isForm = true;
	fomDom.find('[data-required]').unbind('keyup');
	fomDom.find('[data-required]').each(function(){
		if(!$(this).val()){
			isForm = false;
			$(this).addClass('err');
			$(this).bind('keyup',function(){
				if($(this).val() && $(this).hasClass('err')){
					$(this).removeClass('err')
				}
			})
		}
	});
	return isForm;
}

/*--显示详情窗--*/
var fixedInfo = $(".fixedInfo");
var explain = $(".fixedInfo .explain");
var svInfos = $(".fixedInfo .svInfos");
var cancelInfo = $(".fixedInfo .cancel");
svInfos.height(fixedInfo.height() - 50)
$(window).resize(function(){
	svInfos.height(fixedInfo.height() - 50)
})
function fnFixedInfoShow(showHtml, txt) {
	explain.text(txt);
	svInfos.html(showHtml);
	fixedInfo.animate({right:0},200)
}
cancelInfo.click(function () {
	fixedInfo.animate({right:'-80%'},200,function () {
		explain.text('');
		svInfos.html('');
	})
	$(".fixedInfo .svname").unbind()
})

/*--显示信息窗--*/
var fixedInfo2 = $(".fixedInfo2");
var fixedEye = $(".fixedInfo2 .fixedEye");
var fixedMian = $(".fixedInfo2 .fixedMian");
var fixedAddEle = $(".fixedInfo2 .fixedMian .addEle");
var cancelInfo2 = $(".fixedInfo2 .cancel2");
$(".fixedMian .addEle").css('maxHeight',$(window).height()-100+'px');
function fnFixedinfo2Show(showHtml,callback){
	fixedInfo2.css('display','block');
	if(showHtml){
		fixedAddEle.html(showHtml)
	}
	var mhg = fixedMian.height();
	fixedEye.animate({height:mhg+'px',marginTop:-mhg/2+'px'},280,function(){
		$(this).css('overflow','visible')
	})
	callback(fixedMian);
}
cancelInfo2.click(function(){
	fixedEye.animate({height:'0px',marginTop:'0px'},200,function(){
		fixedAddEle.children().remove();
		fixedInfo2.css('display','none');
		$(this).css('overflow','hidden');
	})
})