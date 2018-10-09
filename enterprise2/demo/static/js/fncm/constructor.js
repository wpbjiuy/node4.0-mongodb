function FnData(dataName, cut){
	this.dataName = dataName
	this.cut = cut
	this.result = {}
	this.arNames = {
		obj:'data-objname',
		arObj:'data-arname'
	}
	this.addAr = {
		addBtn:'.addArBtn'
	}
	this.objAr = {
		ports:'.addProtMap'
	}
	this.isMap = ['environment']

	//GetData
	this.getData = function(dom,isEmpty){
		this.isEmpty = isEmpty
		return this.objGetData(dom, this.dataName, 1)
	}

	this.objGetData = function(dom, dataName, num){
		var obj1 = {}
		var fnThs = this;

		dom.find('['+dataName+']').each(function(){
			var ths = $(this)
			var ds = ths.attr(dataName)
			var dataType = ths.attr('data-type')
			var thsType = ths.attr('type')

			if(ths.attr('data-fix')) return true;

			if(dataType == 'object'){

				var thsData = fnThs.objGetData( ths, fnThs.dataName+'-'+num, num+1 )
				
				if(!$.isEmptyObject(thsData) || fnThs.isEmpty){
					if(ds.indexOf(fnThs.cut) != -1){
						var dsAr = ds.split(fnThs.cut)
						if(obj1[dsAr[0]]){
							if(obj1[dsAr[0]][dsAr[1]]){
								obj1[dsAr[0]][dsAr[1]] = $.extend(true, {}, obj1[dsAr[0]][dsAr[1]], thsData, true)
							}else{
								obj1[dsAr[0]][dsAr[1]] = thsData
							}
						}else{
							obj1[dsAr[0]] = {}
							obj1[dsAr[0]][dsAr[1]] = thsData
						}
					}else{
						if(obj1[ds]){
							obj1[ds] = $.extend(true, {}, obj1[ds], thsData, true)
						}else{
							obj1[ds] = thsData
						}
					}	
				}
						

			}else if(dataType == 'array'){
				var dsAr = [],
					dataAr = [];
				if(ds.indexOf(fnThs.cut) != -1){
					dsAr = ds.split(fnThs.cut)
					dataAr = obj1[dsAr[0]][dsAr[1]]
				}else{
					dataAr = obj1[ds]
				}

				var thsData = fnThs.arrayGetData(ths, dataAr, fnThs, 1)
				
				if(!$.isEmptyObject(thsData)){
					if(dsAr.length){
						if(obj1[dsAr[0]]){
							obj1[dsAr[0]][dsAr[1]] = thsData
						}else{
							obj1[dsAr[0]] = {}
							obj1[dsAr[0]][dsAr[1]] = thsData
						}
					}else{
						obj1[ds] = thsData
					}
				}

			}else{
				if(ths.val() || fnThs.isEmpty){
					obj1 = fnThs.splitDataNameTwo(ths, ds, obj1)
				}	
			}
		})
		
		return obj1
	}

	this.arrayGetData = function(ths, ar, fnThs, num, arNum){
		var resultAr = ar ? ar : []
		var thsType = ths.attr('data-arType')

		function getArData(dom,dataName){
			var arObj = {}
			var thsInput = dom.find('['+dataName+']')
			var childDataName = dom.attr('data-childname') || fnThs.dataName  //子元素 data-name 的 value

			thsInput.each(function(){
				var thsVal
				var _ths = $(this)
				var ds = _ths.attr(dataName)
				var thsDataType = _ths.attr('data-type')
				
				if(thsDataType == 'object'){

					thsVal = fnThs.objGetData(_ths, childDataName+'-'+num, num+1 )

				}else if(thsDataType == 'array'){

					thsVal = fnThs.arrayGetData(_ths, arObj[ds], fnThs, 1, (arNum?arNum+1:1))

				}else{

					if(_ths.attr('type') == 'checkbox'){
						if(!_ths.get(0).checked) return true
					}else{
						if(!_ths.val()) return true
					}
					thsVal =  _ths.val()
				}

				if(typeof(thsVal) == 'object'){
					if(!$.isEmptyObject(thsVal) || fnThs.isEmpty){
						setArObj(ds,thsVal)
					}
				}else{
					if(thsVal || fnThs.isEmpty){
						setArObj(ds,thsVal)
					}
				}

			})
			resultAr.push(arObj)

			function setArObj(ds,thsVal){
				var iscut = ds.indexOf('-') != -1

				if(iscut){
					var ar = ds.split('-')
					if(!arObj[ar[0]]){
						arObj[ar[0]] = {}
						if(arObj[ar[0]][ar[1]]){
							arObj[ar[0]][ar[1]] = $.extend(true, {}, arObj[ar[0]][ar[1]], thsVal)
						}else{
							arObj[ar[0]][ar[1]] = thsVal
						}
					}else{
						if(arObj[ar[0]][ar[1]]){
							arObj[ar[0]][ar[1]] = $.extend(true, {}, arObj[ar[0]][ar[1]], thsVal)
						}else{
							arObj[ar[0]][ar[1]] = thsVal
						}
					}
				}else{
					if(arObj[ds]){
						arObj[ds] = $.extend(true, {}, arObj[ds], thsVal)
					}else{
						arObj[ds] = thsVal
					}
				}

				return arObj
			}
		}

		if(thsType == 'objAr'){
			var arName = !arNum ? 'data-arname' : 'data-arname-'+arNum
			var dataAr = !arNum ? 'obj' : 'obj-'+arNum
			ths.find('[data-ar="'+dataAr+'"]').each(function(){

				getArData($(this),(arName||'data-arname'))
			})

		}else if(thsType == 'obj'){

			getArData(ths,this.arNames.obj)
			
		}else{
			var thsInput = ths.find('input')
			
			resultAr = thsInput.map(function(){
				if(this.type == 'checkbox'){
					if(this.checked) return this.value
				}else{
					if(this.value) return this.value
				}
			}).get()
		}
		
		return resultAr
	}

	this.splitDataNameTwo = function(ths, ds, obj){
		var resultObj = obj
		var _obj = {}
		var _ds
		var thsType = ths.attr('type')

		if(ds.indexOf(this.cut) != -1){

			_ds = ds.split(this.cut)

			var thsData = this.isTypeVal(ths, thsType)
			if(thsData || this.isEmpty)	{
				_obj[_ds[1]] = thsData

				if(resultObj[_ds[0]]){
					resultObj[_ds[0]] = $.extend(true, {}, resultObj[_ds[0]], _obj)
				}else{
					resultObj[_ds[0]] = _obj
				}
			}

		}else{
			var thsData = this.isTypeVal(ths, thsType)
			if(thsData || this.isEmpty)		
				resultObj[ds] = thsData
		}

		return resultObj
	}

	this.isTypeVal = function(ths, thsType){
		var resultVal = ''
		var thsVal = this.filter(ths)

		if(thsType == 'radio'){

			if(ths.get(0).checked) resultVal = thsVal						

		}else if(thsType == 'checkbox'){

			if(ths.get(0).checked) resultVal = thsVal

		}else{
			resultVal = thsVal
		}

		return resultVal
	}

	this.filter = function(ths,txt){
		var thsFilter = ths.attr('data-filter') //data-filter='expr | type'
		var thsVal = txt || ths.val()

		if(thsFilter){
			if(txt){
				setVal()
			}else{
				getVal()
			}
		}

		return thsVal;

		function getVal(){
			var flr = thsFilter.split(' | ')
			if(flr[1] === 'AddString'){  //前面追加
				thsVal = flr[0] + thsVal
			}else if(flr[1] === 'StringAdd'){  //后面追加
				thsVal =  thsVal + flr[0]
			}else if(flr[i] === 'Function'){   //函数返回值
				thsVal = eval(flr[0]+'("'+thsVal+'")', 'get')
			}
		}
		function setVal(){
			var flr = thsFilter.split(' | ')
			if(flr[1] === 'AddString'){
				if(thsVal.indexOf(flr[0]) == 0)
					thsVal = thsVal.slice(flr[0].length)
			}else if(flr[1] === 'StringAdd'){
				if(thsVal.indexOf(flr[0]) == thsVal.length - flr[0].length)
					thsVal =  thsVal.slice(0, -flr[0].length)
			}else if(flr[i] === 'Function'){
				thsVal = eval(flr[0]+'("'+thsVal+'")', 'set')
			}
		}
	}

	this.getVal = function(obj, objName, thsVal){
		obj.objName = thsVal
	}

	//setData
	this.setData = function(dom, data, dataName, childDataName){
		this.objSetData(dom, data, dataName||this.dataName, 1, childDataName)
	}

	this.objSetData = function(dom, data, dataName, num, childDataName, arNum){
		var thsfn = this
		dom.find('['+dataName+']').each(function(){
			var ths = $(this)
			var ds = ths.attr(dataName)
			var dataType = ths.attr('data-type')
			var thsData = thsfn.thsSetData(ds, data)
			var _dataName = ''
			
			if(childDataName)
				_dataName = childDataName
			else
				_dataName = num <= 1 ? dataName : dataName.slice(0,dataName.lastIndexOf('-'))

			if(!thsData) return true

			if(dataType === 'object'){

				thsfn.objSetData(ths, thsData, _dataName+'-'+num, num+1, childDataName)
			}else if(dataType === 'array'){

				thsfn.arraySetData(ths, thsData, arNum)
			}else{

				thsfn.setVal(ths, thsfn.filter(ths, thsData))
				if(ths.attr('onchange')){
					ths.change()
				}
			}
		})
	}

	this.arraySetData = function(ths, data, arNum){
		var thsArType = ths.attr('data-arType')
		var thsType = ths.attr('type')
		var childDataName = ths.attr('data-childname') || this.dataName  //子元素 data-name 的 value
		var thsData = null
		var addArBtn = ths.find(this.addAr.addBtn).length ? ths.find(this.addAr.addBtn) : ths.find('[onclick]')
		var childIsCheckbox = ths.find('input[type="checkbox"]').length

		if(thsArType === 'obj'){

			this.objSetData(ths, data, this.arNames.obj, 1, childDataName)
		}else if(thsArType === 'objAr'){

			var arName = !arNum ? this.arNames.arObj : this.arNames.arObj+'-'+arNum
			var dataAr = !arNum ? 'obj' : 'obj-'+arNum

			for (var i = 0; i < data.length; i++) {
				if(addArBtn.length){

					if(i != 0) { addArBtn.eq(0).click() }
					this.objSetData(ths.find('[data-ar="'+dataAr+'"]:last'), data[i], arName, 1, childDataName, (arNum?arNum+1:1))
				}
				
			}
		}else{

			for (var i = 0; i < data.length; i++) {
				if(addArBtn.length){

					addArBtn.eq(0).click()
					ths.find('input:last').val(data[i])
				}else if(childIsCheckbox){console.log()

					var thsChecked = ths.find('input[value="'+data[i]+'"]').get(0)?ths.find('input[value="'+data[i]+'"]').get(0).checked:null
					if(!thsChecked){
						ths.find('input[value="'+data[i]+'"]').click()
					}
					
				}
				
			}
		}
	}

	this.thsSetData = function(ds, data){
		var iscut = ds.indexOf(this.cut) != -1
		var resultData = null

		if(iscut){
			var ar = ds.split(this.cut)
			if(data[ar[0]] && data[ar[0]][ar[1]]){
				resultData = data[ar[0]][ar[1]]
			}
		}else{
			if(data[ds]){
				resultData = data[ds]
			}
		}

		return resultData
	}

	this.setVal = function(ths, thsData){
		var thsType = ths.attr('type')

		if(thsType === 'checkbox' || thsType === 'radio'){

			if(ths.val() == thsData){
				ths.get(0).checked = true
			}
		}else if(ths[0].localName == 'textarea'){
			ths.text(thsData)
		}else{
			ths.val(thsData)
		}
	}
}

function objMerge(obj1, obj2){
	for(var dr in obj2){
		if(obj1[dr]){
			if(typeof(obj1[dr]) == 'object'){
				if(obj1[dr] instanceof Array){
					if(obj2[dr] instanceof Array){
						obj2[dr].forEach(function(item, idx){
							if(obj1[dr].indexOf(item) == -1){
								obj1[dr].push(item);
							}
						})
					}else{
						obj1[dr] = obj2[dr]
					}
				}else{
					obj1[dr] = objMerge(obj1[dr], obj2[dr])
				}
			}else{
				obj1[dr] = obj2[dr]
			}
		}else{
			obj1[dr] = obj2[dr]
		}
	}
	return obj1
}

var fndata = new FnData('data-name','-')