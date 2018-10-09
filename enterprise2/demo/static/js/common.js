//var dp_api_server = 'http://localhost:9090';

/*--给有属性dataName 的 dom元素赋值，只限text()方法--*/
function setData(dom,dataName,data){
	dom.each(function(){
		var ds = $(this).attr(dataName);
		if(ds){
			if(ds.indexOf('-') != -1){
				var arrds = ds.split('-');
				if(data[arrds[0]][arrds[1]]){
					$(this).text(data[arrds[0]][arrds[1]]);
				}
			}else{
				if(data[ds]){
					$(this).text(data[ds]);
				}
			}
		}	
	});
}

/*--获取有属性dataName 的 dom元素内容并返回一个对象，只限text()方法--*/
function getData(dom,dataName) {
	var obj = {};
	dom.each(function(){
		if(!$(this).attr('data-fix')){
			var ds = $(this).attr(dataName);
			if(ds.indexOf('-') != -1){
				var arrds = ds.split('-');
				var objds = {};
				objds[arrds[1]] = $(this).text();
				obj[arrds[0]] = objds;
			}else{
				obj[ds] = $(this).text();
			}
		}
	});
	return obj;
}

/*--给有属性dataName 的 dom元素赋值，只限val()方法--*/
var seths, setDs, setDataType;
function setInputData(dom,dataName,data){
	dom.each(function(){
		var ths = $(this);
		var ds = ths.attr(dataName);
		var dataType = ths.attr('data-type');
		var thsType = ths.attr('type');
		if(ds && data){
			if(dataType){
				if(dataType == 'object3'){
					var thsData = splitDataNameTwo(ds,data);
					setInputData(ths.find('[data-jname]'),'data-jname',thsData);
				}else if(dataType == 'object'){
					var thsData = splitDataNameTwo(ds,data);
					setInputData(ths.find('[data-oname]'),'data-oname',thsData);
				}
			}else{
				var thsData = splitDataNameTwo(ds,data);
				if(thsData){
					if(thsType == 'radio'){
						if(ths.val() == thsData.toString()) ths.get(0).checked = true;
					}else if(thsType == 'checkbox'){
						if(ths.val() == thsData.toString()) ths.get(0).checked = true;
					}else{
						ths.val(thsData);
					}
				}
			}
		}	
	});
}

function splitDataNameTwo(dataName,data){
	var result;
	if(dataName.indexOf('-') != -1){
		var arrds = dataName.split('-');
		result = data[arrds[0]] ? data[arrds[0]][arrds[1]] : '';
	}else{
		result = data[dataName];
	}
	return result;
}

/*--获取有属性dataName 的 dom元素内容并返回一个对象，只限val()方法--*/
function getInputData(dom,dataName) {
	var obj = {};
	dom.each(function(){
		var ds = $(this).attr(dataName);
		if(!$(this).attr('data-fix')){
			if($(this).attr('data-type') == 'arrayObj'){  //判断对象是否为数组(成员为对象)
				if(ds.indexOf('-') != -1){  //判断对象是否是二级对象
					var arrds = ds.split('-');
					if(!obj[arrds[0]]){
						obj[arrds[0]] = {};
					}
					if(!obj[arrds[0]][arrds[1]]){
						obj[arrds[0]][arrds[1]] = [];
					}
					var arObj = {};
					$(this).find('[data-arname]').each(function(){
						var ards = $(this).attr('data-arname');
						if($(this).val() && !$(this).attr('data-fix')){
							arObj[ards] = $(this).val()
						}else if($(this).attr('data-type') == 'arrayCkb'){
							var ckar = fnArCkb($(this),arObj[ards]);
							if(ckar.length){
								arObj[ards] = ckar;
							}
						}
					})
					if(!$.isEmptyObject(arObj)){
						if(obj[arrds[0]][arrds[1]]){  //判断对象是否存在，如果存在就合并
							obj[arrds[0]][arrds[1]].push(arObj)
						}else{
							obj[arrds[0]][arrds[1]] = arObj;
						}
					}	
				}else{
					if(!obj[ds]){
						obj[ds] = [];
					}
					var arObj = {};
					$(this).find('[data-arname]').each(function(){
						var ards = $(this).attr('data-arname');
						if(!$(this).attr('data-fix')){
							if($(this).val()){
								arObj[ards] = $(this).val()
							}else if($(this).attr('data-type') == 'arrayCkb'){
								var ckar = fnArCkb($(this),arObj[ards]);
								if(ckar.length){
									arObj[ards] = ckar;
								}
							}
						}
					})
					if(!$.isEmptyObject(arObj)){
						obj[ds].push(arObj);
					}
				}
			}else if($(this).attr('data-type') == 'array'){  //判断对象是否为数组
				var thsAr = [];
				$(this).find('input').each(function(){
					if($(this).attr('type') == 'text'){
						var thsVal = $(this).val();
						if(thsVal){
							thsAr.push(thsVal)
						}
					}
				})
				if(thsAr.length){
					if(!obj[ds]){
						obj[ds] = [];
					}
					obj[ds] = thsAr;
				}
			}else if($(this).attr('data-type') == 'arrayCkb'){  //判断对象是否为数组(成员为checkbox的值)
				var ckar = fnArCkb($(this),obj[ds]);
				if(ckar.length){
					obj[ds] = ckar;
				}
			}else if($(this).attr('data-type') == 'object'){  //判断对象是否为对象
				var objds = getInputData($(this).find('[data-oname]'),'data-oname');
				if(!$.isEmptyObject(objds)){
					if(ds.indexOf('-') != -1){  //判断对象是否是二级对象
						var arrds = ds.split('-');
						var objdsz = {};
						objdsz[arrds[1]] = objds
						if(obj[arrds[0]]){  //判断对象是否存在，如果存在就合并
							obj[arrds[0]] = $.extend(true,{},obj[arrds[0]],objdsz);
						}else{
							obj[arrds[0]] = objdsz;
						}
					}else{
						if(obj[ds]){
							obj[ds] = $.extend(true,{},obj[ds],objds);
						}else{
							obj[ds] = objds;
						}
					}
				}
			}else if($(this).attr('data-type') == 'object3'){
				var objds = getInputData($(this).find('[data-jname]'),'data-jname');
				if(!$.isEmptyObject(objds)){
					if(ds.indexOf('-') != -1){  //判断对象是否是二级对象
						var arrds = ds.split('-');
						var objdsz = {};
						objdsz[arrds[1]] = objds
						if(obj[arrds[0]]){  //判断对象是否存在，如果存在就合并
							obj[arrds[0]] = $.extend(true, {}, obj[arrds[0]], objdsz);
						}else{
							obj[arrds[0]] = objdsz;
						}	
					}else{
						if(obj[ds]){
							obj[ds] = $.extend(true, {}, obj[ds], objds);
						}else{
							obj[ds] = objds;
						}
					}
				}
			}else{
				if($(this).val()){
					if(ds.indexOf('-') != -1){  //判断对象是否是二级对象
						var arrds = ds.split('-');
						var objds = {};

						if($(this).attr('type') == 'radio'){
							if($(this).get(0).checked){
								objds[arrds[1]] = $(this).val();
							}
						}else{
							objds[arrds[1]] = $(this).val();
						}

						if(obj[arrds[0]]){  //判断对象是否存在，如果存在就合并
							obj[arrds[0]] = $.extend(true, {}, obj[arrds[0]], objds);
						}else{
							obj[arrds[0]] = objds;
						}
					}else{
						if($(this).attr('type') == 'radio'){
							if($(this).get(0).checked){
								obj[ds] = $(this).val();
							}
						}else if($(this).attr('type') == 'checkbox'){
							if($(this).get(0).checked){
								obj[ds] = $(this).val();
							}
						}else{
							obj[ds] = $(this).val();
						}	
					}
				}
			}
		}
		//返回选中的多选框数组方法
		function fnArCkb(ths,objar){
			if(!objar){
				objar = [];
			}
			ths.find('input[type="checkbox"]').each(function(){
				if($(this).get(0).checked && !$(this).attr('data-fix')){
					objar.push($(this).val());
				}
			});
			return objar;
		}
	});
	return obj;
}

/*--获取http参数--*/
function getHttpParam(param){
	var httpSearch = location.search;
	var paramVal;
	if(httpSearch.indexOf('&') == -1){
		if(httpSearch.indexOf(param) != -1){
			var pl = httpSearch.indexOf('=');
			paramVal = httpSearch.slice(pl+1);
		}
	}else{
		var arr = httpSearch.split('&');
		for(var i=0; i<arr.length; i++){
			if(arr[i].indexOf(param) != -1){
				var pl = arr[i].indexOf('=');
				paramVal = arr[i].slice(pl+1);
				break;
			}
		}
	}
	return paramVal;
}

/*--提示弹窗--*/
function fnAlert(txt,hint,callback){
	var hintTxt = hint ? '' : '!';
	var icon = '';
	if(hint == 'ok'){
		icon = ' icon-checkmark';
	}else if(hint == 'err'){
		icon = ' icon-cross';
	}
	var atHtml = '<div class="fixed fixedAt">'+
					'<div class="fixed_bg"></div>'+
				 	'<div class="atInfoBox">'+
				 		'<div class="atPoRt">'+
				 			'<a class="icon-cross cancel" href="javascript:void(0)"></a>'+
				 			'<div class="info">'+
				 				'<div class="fl radius_a hintImg'+icon+'">'+hintTxt+'</div>'+
				 				'<div class="fl wordWrap txt"><p>'+txt+'</p></div>'+
				 				'<div class="clr"></div>'+
				 			'</div>'+
				 			'<div class="btns"><button class="cancel radius_5" autofocus="autofocus">确 认</button></div>'+
				 		'</div>'
				 	'</div>'+
				 '</div>';
	$('body').append(atHtml);
	var atTxt = $(".fixedAt .txt");
	var txtTop = ($('.fixedAt .info').height()-atTxt.height())/2;
	atTxt.css('marginTop',txtTop+'px');
	$('.fixedAt .cancel').click(function(){
		$(this).parents('.fixed').fadeOut(200,function(){
			$(this).remove()
			if(callback){
				callback()
			}
		});
	})
	$('.fixedAt .btns button').focus()
}

function fnConfirm(txt,callback){
	var atHtml = '<div class="fixed fixedAt">'+
					'<div class="fixed_bg"></div>'+
				 	'<div class="atInfoBox">'+
				 		'<div class="atPoRt">'+
				 			'<a class="icon-cross cancel" href="javascript:void(0)"></a>'+
				 			'<div class="info">'+
				 				'<div class="fl radius_a hintImg">？</div>'+
				 				'<div class="fl wordWrap txt"><p>'+txt+'</p></div>'+
				 				'<div class="clr"></div>'+
				 			'</div>'+
				 			'<div class="btns"><button class="ok radius_5">确 认</button> <button class="cancel radius_5">取 消</button></div>'+
				 		'</div>'
				 	'</div>'+
				 '</div>';
	$('body').append(atHtml);
	var atTxt = $(".fixedAt .txt");
	var txtTop = ($('.fixedAt .info').height()-atTxt.height())/2;
	atTxt.css('marginTop',txtTop+'px');
	$('.fixedAt .cancel').click(function(){
		$(this).parents('.fixed').fadeOut(200);
	});
	$('.fixedAt .ok').click(function(){
		$(this).parents('.fixed').fadeOut(200);
		callback();
	});
}

function fnFixedHint(txt){
	$(".fixedHint").remove();
	var hintHtml =  '<div class="fixedHint rtx3d">'+
						'<a href="javascript:void(0)" class="icon-cross cancel"></a>'+
						'<div>'+
							'<div class="fl fixedIcon">!</div>'+
							'<div class="fl fixedInfos">'+txt+'</div>'+
							'<div class="clr"></div>'+
						'</div>'+
					'</div>';
	$('body').append(hintHtml);
	$(".fixedHint .cancel").click(cancel)
	var fiedHintIcon = $(".fixedHint .fixedIcon");
	var iconMrTop = (fiedHintIcon.parent().height()-fiedHintIcon.height())/2;
	fiedHintIcon.css('marginTop',iconMrTop+'px');

	var fixedHint = $(".fixedHint");
	function cancel() {
		fixedHint.stop().animate({opacity:0}, 500, function () {
			$(this).remove();
		})
	}

	var itz = setTimeout(cancel,5000);

	fixedHint.unbind('hover');
	fixedHint.hover(function(){
		clearTimeout(itz);
		fixedHint.stop().animate({opacity:'1'});
	},function(){
		itz = setTimeout(cancel,1000);
	})
}

/**用于生成弹窗编辑框HTML
*ttl => 标题
*sbmTxt => 按钮名称
*data => {
	name:'名称',
	type:'类型',
	placeholder:'提示',
	dataName:'数据名称',
	style:'样式',
	verify:'验证', 
	fix:'是否提交数据',
	eId:'输入层ID',
	slcId:'select ID',
	required:'是否必填'
}
**/
function fnEditInputHtml(ttl, sbmTxt, data){
	var _html = '<h2 class="ttl">'+ttl+'</h2><div class="editFrom">'

	for (var i = 0; i < data.length; i++) {
		var dt = data[i];
		if(!(dt instanceof Array)){
			if(dt.isChunk){
				_html += '<div class="chunk">'

				if(dt.TheDivider) {
					_html += '<div class="TheDivider"><span class="test">'+dt.TheDivider+'</span></div>'
				}

				for (var j = 0; j < dt.content.length; j++) {
					mainHtml(dt.content[j])
				}	

				_html += '</div>'
			}else{
				_html += '<div class="etxt2" data-name="'+dt.dataName+'" data-type="'+dt.dataType+'">'+dt.html+'</div>'
			}
		}else{
			mainHtml(dt)
		}	
	}

	function mainHtml(itemData){
		_html += '<div class="etxt2">'

		for (var i = 0; i < itemData.length; i++) {
			var f = ''
			if(itemData.length != 1){
				f = i==0?'fl':'fr'
			}else{
				f = 'one'
			}
			var d = itemData[i];
			var editCc = '';
			if(d.html){
				editCc = d.html
			}else{
				if(d.type == 'select'){
					editCc = '<select class="bdcol" id="'+(d.slcId?d.slcId:'')+'" data-name="'+d.dataName+'">'
					if(d.slcAr.length){
						for (var j = 0; j < d.slcAr.length; j++) {
							editCc += '<option value="'+d.slcAr[j].value+'">'+d.slcAr[j].name+'</option>'
						}
					}
					editCc += '</select>'
				}else{
					editCc = '<input class="bdcol borderBox" type="'+d.type+'" placeholder="'+d.placeholder+'" data-name="'+d.dataName+'"'+
					 +(d.required?' data-required="true"':'')+(d.verify?' data-verify="'+d.verify+'"':'')+(d.fix?' data-fix="true"':'')+' />'
				}
			}
			_html += '<div class="'+f+' etxte"'+(d.style?' style="'+d.style+'"':'')+(d.dataTypeZ?' data-type="'+d.dataTypeZ+'"':'')+(d.eId?' id="'+d.eId+'"':'')+'>'+
						 '<p class="w2 txtEllipsis txtname">'+d.name+'</p>'+
						 '<div class="w2">'+editCc+'</div>'+
					'</div>'
		}

		_html += '<div class="clr"></div></div>'
	}

	_html += '<div class="etxt sbmBox">'+
			'<input class="sbm" type="button" value="'+sbmTxt+'" />'+
			'<input class="cancel" onclick="closeFixed2()" type="button" value="取消" />'+
			'</div></div>';

	return _html
}

/*--单选按钮事件,给回调函数放回id--*/
function redioCkd(chkDomBox,callback){
	var ckRd = chkDomBox.find('input[type="radio"]');
	ckRd.click(function(){
		callback($(this).attr('id'));
	})
}

/*--上传文件--*/
function fnUploadFiles(event, callback) {
	var uploadFile = event.target.files[0];
	var reader = new FileReader();
	reader.onload = function(event) {
		var str = event.target.result;
		callback(str)
	};
	reader.readAsText(uploadFile);
}


/*--跳转到前一个链接--*/
function goBack(){
  window.history.back()
}

/*--格式化时间 （2010/1/1 To 2010-01-01）--*/
String.prototype.formatDate = function() {
	var ar = this.split('/');
	var str = '';
	for(var i = 0; i < ar.length; i++){
		if(ar[i].length == 1){
			ar[i] = '0' + ar[i]
		}
		if(i != ar.length-1)
			str += ar[i]+'-';
		else
			str += ar[i];
	}
	return str;
};

/*--ajax--*/
function FnAjax1(atype){
	var ajaxType = atype;
	return function (Url, callback) {
		$.ajax({
			url:Url,
			type:ajaxType,
			error:function(xhr,err){
				callback(xhr)
			},
			success:function(data,status,xhr){
				callback(xhr,data)
			}
		})
	}
	
}
function FnAjax2(atype){
	var ajaxType = atype;
	return function (Url,Data,callback) {
		$.ajax({
			url:Url,
			type:ajaxType,
			data:JSON.stringify(Data),
			dataType:'json',
			contentType:'application/json',
			error:function(xhr,err){
				callback(xhr,err)
			},
			success:function(data,status,xhr){
				callback(xhr,data)
			}
		})
	}
}


function fnTitle(dom){
	var dt = dom?dom.find('[data-title]'):$('[data-title]');
	dt.hover(function(e){
		var ths = $(this);
		var txt = ths.attr('data-title');
		var _offset = ths.offset(),
			t = _offset.top+(ths.context.clientHeight||ths.height()+5)+5,
			l = _offset.left,
			ex = e.offsetX;

		if(txt){
			$('body').append('<div class="titleBox" style="top:'+t+'px;left:'+l+'px;"><i></i><content>'+txt+'</content></div>')
			var ttBox_w = $(".titleBox").width()
			var ttBox_oftL = $(".titleBox").offset().left

			if( (ttBox_w+ttBox_oftL+40) >= $(window).width() ){console.log(ttBox_w+ttBox_oftL)
				ttBox_w -= 20
				$(".titleBox").css('width',ttBox_w+'px')
			}

			if(ex> ttBox_w) ex = ttBox_w
			
			$(".titleBox i").css('left',(ex>6?ex-6:ex)+'px')

		}
	},function(){
		$(".titleBox").remove()
	})
}
fnTitle()