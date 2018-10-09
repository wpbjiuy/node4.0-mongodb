(function($,wd){
	var fc = cm.fnInfo('edit')
	var fm = cm.fnInfo()
	var leftdir = $("#leftdir")
	var tblists = $('#tblists')
	var dyListPages = $("#dyListPages")
	var createdir = $("#createdir")
	var createcontent = $("#createcontent")
	var thsDirData = []
	var thsData = []
	var setting = {
		id:'',
		limit:20,
		page:1
	}
	var thsdirUrl = '/newsdir'
	var thsUrl= '/news'

	var showTbac = [
		{name:'vimg',txt:'图标',style:'width:100px;',filte:function(txt,item){return '<img class="vimg" src="'+txt[0]+'" onerror="javascript:this.src=\'/images/defulte.jpg\'" />'}},
		{name:'name',txt:'标题'},
		{name:'releaseTime',txt:'发布时间'},
		{name:'describe',txt:'简要'}
	]

	wd.showTbthSlcHtml = setShowTbthSlcHtml(showTbac)

	mianObj.showMainScroll && mianObj.showMainScroll.id && $('#'+mianObj.showMainScroll.id).remove()

	// 内容列表
	var tmain = cm.fnTbList({
		getData:{
			url:'get'+thsUrl,
			setting:setting,
			page:'page',
			totalPage:'amount',
			pageDom:dyListPages,
			dataPath:'data'
		},
		dataId:'_id',
		isShow:function(item){
			return true;
		},
		fixedth:true,
		// chk:true,
		csle:[
			{css:'cedit', icon:'icon-quill', txt:'编辑',fnCk:fnEdit},
			{css:'csearch', icon:'icon-eye', txt:'查看',fnCk:fnEye},
			{css:'ccross', icon:'icon-cross', txt:'删除',fnCk:fnDelete}
		],
		th:showTbac,
		tbCss:'tblist_2',
		addDom:tblists
	},function(data){console.log(data)
		thsData = data;
		mianObj.showMainScroll = tblists.perfectScrollbar()
	})

	//目录列表
	var tdir = cm.fnDirList({
		get:{
			url:'get'+thsdirUrl,
		},
		cls:[
			{txt:'修改',css:'cedit',fn:fnDirEdit},
			{txt:'删除',css:'cdelete',fn:fnDirDelete}
		],
		dirName:'name',
		addDom:leftdir
	},function(data,dirUl){
		thsDirData = data

	}).click(function(ths, id){
		tmain.fnGetData({id:id})
	});

	$('#seekBtn').click(function(){
		cm.sbm($(this).parent(), function(data){console.log(data)
			// data.date = new Date(data.date).toLocaleDateString().replace(/\//g,'-')
			$.extend(true,tmain.getSetting,data)
			tmain && tmain.fnGetData()
		})
	})

	wd.showTmain = tmain;

	function fnDirEdit(ths, thsli, thsData){
		var idx = parseInt($(this).attr('data-path'))
		var thsA = $(this).parents('li:first').find('a:eq(0)')
		fc.show(createDir,200).sbm(function(data){
			var updateData = $.extend(true, {}, thsDirData[idx], data)
			$.post('update'+thsdirUrl, {_id:thsDirData[idx]._id, update:updateData}, function(data,status,xhr){
				if(xhr.status == 200){
					thsDirData[idx] = updateData
					thsA.text(thsDirData[idx].name)
					cm.fnFixedHint('修改目录成功！')
				}
			})
		}).set(thsDirData[idx])
	}

	function fnDirDelete(ths, thsli, thsData){
		var idx = parseInt($(this).attr('data-path'))
		var removeDom = $(this).parents('li:first')
		
		cm.fnConfirm('您确定要删除这个吗？',function(){
			$.post('delete'+thsdirUrl,{_id:thsDirData[idx]._id},function(data,status,xhr){
				if(xhr.status == 200){
					thsDirData.splice(idx,1)
					cm.fnFixedHint('删除目录成功！')
					tdir.update('delete',removeDom)
				}
			})
		})
	}

	function fnEdit(e) {
		var ths = $(this)
		var id = ths.attr('data-id')
		var idx = parseInt(ths.attr('data-path'))

		fc.show({
			showHtml:newsHtlm,
			ttl:'更新-'+thsData[idx].name,
			cls:[
				{
					dom:'.slcimg',
					event:'click',
					fn:slcImgObj.slcImgs
				}
			]
		},function(fdom){

			if(thsData[idx].vimg){
				$.each(thsData[idx].vimg,function(i,item){
					fdom.find('.vimg:eq(0)').append('<img src="'+item+'" />')
				})
			}

		}).sbm(function(data){
			if(data.vimg) data.vimg = data.vimg.split(',');

			var upData = $.extend(true,{},thsData[idx],data)
			var fomData = {_id:id, update:upData}

			$.post('update'+thsUrl, fomData, function(data,status,xhr){
				if(xhr.status == 200){
					thsData[idx] = upData
					tmain.addListCc(thsData)
				}
			})

		}).set(thsData[idx], function(fdom){
			var editor = fdom.find('[data-name="details"]').wangEditor({
	       uploadUrl: '/fs/fsupload?isOtherImg=true&imgPath=other'
	    });
		})
	}

	function fnEye(e){
		var ths = $(this)
		var idx = parseInt(ths.attr('data-path'))
		var showHhtml = '<h2 class="ttl">'+thsData[idx].name+'</h2>'+thsData[idx].details

		fc.show(showHhtml).sbm(function(data){
			var searchData = $.extend({},thsData[idx],data)
			console.log(searchData)
		})
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
				}
			})
		})
	}

	createdir.click(function(){
		fc.show(createDir,200).sbm(function(data){
			$.post('create'+thsdirUrl,data,function(data,status,xhr){
				if(xhr.status == 201){
					tdir.appendList(data.content)
					thsDirData.push(data.content)
				}
			})
		})
	})

	createcontent.click(function(){
		if(!tdir.ona.id) {
			cm.fnAlert('请先创建目录！')
			return;
		}
		fc.show({
			showHtml:newsHtlm,
			cls:[
				{
					dom:'.slcimg',
					event:'click',
					fn:slcImgObj.slcImgs
				}
			]
		},function(fdom){
			var editor = fdom.find('[data-name="details"]').wangEditor({
	       uploadUrl: '/fs/fsupload?isOtherImg=true&imgPath=other'
	    });
		}).sbm(function(data){
			data.cId = tdir.ona.id
			if(data.vimg) data.vimg = data.vimg.split(',');

			$.post('create'+thsUrl,data,function(data,status,xhr){
				if(xhr.status == 201){
					if(thsData.length)
						tmain.appendList(data.content,thsData.length)
					else
						tmain.addListCc([data.content])
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