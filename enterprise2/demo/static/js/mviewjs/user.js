(function($,wd){
	var fc = cm.fnInfo('edit')
	var fm = cm.fnInfo()
	var tblists = $('#tblists')
	var dyListPages = $("#dyListPages")
	var createdir = $("#createdir")
	var createcontent = $("#createcontent")
	var thsDirData = []
	var thsData = []
	var setting = {}
	var thsUrl= '/user'
	var userType = {a:'超级管理员',b:'管理员'}

	var showTbac = [
		{name:'username',txt:'用户名'},
		{name:'type',txt:'用户身份',filte:function(txt){return userType[txt];}}
	]

	wd.showTbthSlcHtml = setShowTbthSlcHtml(showTbac)

	mianObj.showMainScroll && mianObj.showMainScroll.id && $('#'+mianObj.showMainScroll.id).remove()

	// 内容列表
	var tmain = cm.fnTbList({
		getData:{
			url:'get'+thsUrl,
			setting:setting,
			page:'page',
			totalPage:'total',
			pageDom:dyListPages,
			dataPath:''
		},
		dataId:'_id',
		isShow:function(item){
			return true;
		},
		// fixedth:true,
		// chk:true,
		csle:[
			{css:'cedit', icon:'icon-quill', txt:'修改',fnCk:fnEdit},
			{css:'ccross', icon:'icon-cross', txt:'删除',fnCk:fnDelete}
		],
		th:showTbac,
		tbCss:'tblist_2',
		addDom:tblists
	},function(data){console.log(data)
		thsData = data;
		mianObj.showMainScroll = tblists.perfectScrollbar()
	})

	$('#seekBtn').click(function(){
		cm.sbm($(this).parent(), function(data){console.log(data)
			// data.date = new Date(data.date).toLocaleDateString().replace(/\//g,'-')
			$.extend(true,tmain.getSetting,data)
			tmain && tmain.fnGetData()
		})
	})

	wd.showTmain = tmain;

	function fnEdit(e) {
		var ths = $(this)
		var id = ths.attr('data-id')
		var idx = parseInt(ths.attr('data-path'))

		fc.show({
			showHtml:updateUserHtml,
			ttl:'更新-'+thsData[idx].username
		}).sbm(function(data){
			if(data.newPassword != data.newPasswordTo){
				cm.fnAlert('您输入的用户密码不一致')
				return;
			}

			var upData = $.extend(true,{},thsData[idx],data)
			var fomData = {_id:id, update:upData}
			console.log(upData)
			$.post('update'+thsUrl, fomData, function(data,status,xhr){
				if(xhr.status == 200){
					thsData[idx] = upData
					tmain.addListCc(thsData)
				}else{
					cm.fnFixedHint(data.msg)
				}
			})

		}).set(thsData[idx])
	}

	function fnDelete(e){
		var ths = $(this)
		var idx = parseInt(ths.attr('data-path'))
		var id = ths.attr('data-id')

		cm.fnConfirm('您确定要删除这个吗？',function(){
			$.post('delete'+thsUrl,{_id:id},function(data,status,xhr){
				if(xhr.status == 200){
					thsData.splice(idx,1)
					ths.parents('tr').remove()
					cm.fnFixedHint('删除成功！')
				}else{
					cm.fnFixedHint(data.msg)
				}
			})
		})
	}

	createcontent.click(function(){
		fc.show(createUserHtml,280).sbm(function(data){
			if(data.password != data.passwordTo){
				cm.fnAlert('您输入的用户密码不一致')
				return;
			}

			$.post('create'+thsUrl,data,function(data,status,xhr){
				if(xhr.status == 201){
					tmain.appendList(data.content,thsData.length)
					thsData.push(data.content)
				}else{
					cm.fnFixedHint(data.msg)
				}
			})
		})
	})

	$("#seekTxt").keyup(function(){
	    var txt = $(this).val()
	    tmain && tmain.search(txt)
	})

})(jQuery,window)