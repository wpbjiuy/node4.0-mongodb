var createDir = createHtml.fnEditInputHtml('创建目录', '提交', [
	[
		{
			name:'名称*',
			type:'text',
			placeholder:'请输入目录名称',
			dataName:'name',
			required:true
		},
		{
			name:'描述',
			type:'text',
			placeholder:'请输入目录描述',
			dataName:'describe',
			required:false
		}
	]
])

var createImgHtml = createHtml.fnEditInputHtml('上传图片', '提交', [
	[
		{
			name:'请选择上传的图片',
			html:'<span class="w2 borderBox inputfileBox bkCk">'+
					'<a href="javascript:void(0)"><i class="icon-upload"></i><input id="uploadImg" class="btnHide" type="file" accept="image/*" multiple="multiple" value="上传" /></a></p>'+
				'</span>'+
				'<div class="bdcol borderBox imgs"></div>',
			required:false
		}
	]
])

var createUserHtml = createHtml.fnEditInputHtml('新增用户', '提交', [
	[
		{
			name:'用户名称*',
			type:'text',
			placeholder:'请输入目录名称',
			dataName:'username',
			required:true
		},
		{
			name:'用户身份*',
			type:'select',
			slcAr:[
				{name:'--请选择--',value:''},
				{name:'超级管理员',value:'a'},
				{name:'管理员',value:'b'}
			],
			dataName:'type',
			required:true
		}
	],
	[	
		{
			name:'用户密码*',
			type:'password',
			placeholder:'请输入用户密码',
			dataName:'password',
			required:true
		},
		{
			name:'确认用户密码*',
			type:'password',
			placeholder:'请重复输入用户密码',
			dataName:'passwordTo',
			required:true
		}
	]
])

var updateUserHtml = createHtml.fnEditInputHtml('更新用户', '提交', [
	[
		{
			name:'用户名称*',
			type:'text',
			placeholder:'',
			dataName:'username',
			disabled:true,
			required:true
		},
		{
			name:'用户身份*',
			type:'select',
			slcAr:[
				{name:'--请选择--',value:''},
				{name:'超级管理员',value:'a'},
				{name:'管理员',value:'b'}
			],
			dataName:'type',
			required:true
		}
	],
	[
		{
			name:'原用户密码*',
			type:'password',
			placeholder:'请输入用户密码',
			dataName:'password',
			required:true
		}
	],
	[
		{
			name:'新用户密码*',
			type:'password',
			placeholder:'请输入用户密码',
			dataName:'newPassword',
			required:true
		},
		{
			name:'确认用户密码*',
			type:'password',
			placeholder:'请重复输入用户密码',
			dataName:'newPasswordTo',
			required:true
		}
	]
])

var contentHtlm = createHtml.fnEditInputHtml('新建内容', '提交', [
	[
		{
			name:'名称*',
			type:'text',
			placeholder:'',
			dataName:'name',
			required:true
		},
		{
			name:'描述',
			type:'text',
			placeholder:'请输入用户密码',
			dataName:'describe'
		}
	],
	[
		{
			name:'内容*',
			type:'textarea',
			placeholder:'',
			dataName:'details',
			required:true
		}
	]
])
var productHtlm = createHtml.fnEditInputHtml('添加产品', '提交', [
	[
		{
			name:'名称*',
			type:'text',
			placeholder:'',
			dataName:'name',
			required:true
		},
		{
			name:'描述',
			type:'text',
			placeholder:'',
			dataName:'describe'
		}
	],
	[
		{
			name:'缩略图',
			html:'<span class="btn-info slcimg">请选缩略图</span><div class="imgBox vimg"></div><input type="text" class="hide" data-name="vimg" />'
		}
	],
	[
		{
			name:'产品图片',
			html:'<span class="btn-info slcimgs">请选择产品图片</span><div class="imgBox imagefile"></div><input type="text" class="hide" data-name="imagefile" />'
		}
	],
	[
		{
			name:'内容*',
			type:'textarea',
			placeholder:'',
			dataName:'details',
			required:true
		}
	]
])

var newsHtlm = createHtml.fnEditInputHtml('发布新闻', '提交', [
	[
		{
			name:'标题*',
			type:'text',
			placeholder:'',
			dataName:'name',
			required:true
		},
		{
			name:'简要',
			type:'text',
			placeholder:'',
			dataName:'describe'
		}
	],
	[
		{
			name:'缩略图',
			html:'<span class="btn-info slcimg">请选缩略图</span><div class="imgBox vimg"></div><input type="text" class="hide" data-name="vimg" />'
		}
	],
	[
		{
			name:'内容*',
			type:'textarea',
			placeholder:'',
			dataName:'details',
			required:true
		}
	]
])

var slcImgHtml = '<div class="slcbox">'+
  	'<div class="slcDir">'+
    	'<h3 class="ttl">图片目录 <span class="fr btn-info addImg">新建图片</span></h3>'+
    	'<div class="items imgdir"></div>'+
  	'</div>'+
  	'<div class="slcCc">'+
    	'<h3 class="ttl">图片</h3>'+
    	'<ul class="items imgs"></ul>'+
  	'</div>'+
	'</div>'+
	'<div class="etxt sbmBox">'+
      '<span class="btn-info sbm">提交</span>'+
      '<span class="btn-warning cancel">取消</span>'+
  '</div>'+
  '<p class="hint">注：此选择方式跟window桌面应用选择雷同！按住Shift键进行连续选择！</p>';