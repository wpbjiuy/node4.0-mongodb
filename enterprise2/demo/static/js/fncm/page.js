/*---& dome -> 需要增加翻页的层，allPg -> 翻页的数目 &---*/
function pageOnSet(dome,allPg,cellback,dataAr,fnRow){
	var pageSe_w,page_sum,page_li;
	allPg = Math.floor(allPg);

	dome.append('<div style="position:relative;height:50px;width:100%;left:0;top:0;" onselectstart="return false">'+
					'<div class="pageGo">To Page:<span class="fr go">GO</span><input class="fr" type="number" min="1" max='+allPg+' /></div>'+
					'<div class="nav_page">'+
						'<a href="javascript:void(0)" class="ca prev"> < </a>'+
						'<div class="nav_pages">'+
							'<ul class="nav_pageUl">'+
								
							'</ul>'+
							'<div class="clr"></div>'+
						'</div>'+
						'<a href="javascript:void(0)" class="ca next"> > </a>'+
						'<div class="clr"></div>'+
					'</div>'+
					(fnRow?'<div class="pageRow"><input class="v" type="number" min=1 /></div>':'')+
				'</div>');
	for(var i=1;i<=allPg;i++){
		dome.find(".nav_page .nav_pageUl").append("<li class='pageList'>"+i+"</li>");
	}

	pageAt(); //调用制显示翻页数目方法
	
	dome.find('.nav_page').css('width','auto')
	if(fnRow){
		dome.find('.pageRow').css('left',dome.find('.nav_page').width()+'px')
		if(fnRow instanceof Function){
			dome.on('change','.pageRow .v',function(){
				fnRow($(this).val())
			})
		}
	}
	

	//跳转翻页
	var pageGo = dome.find('.pageGo');
	var minNum = Math.floor((page_li.length-4)/2 > 2 ? 2+(page_li.length-4)/2 : 3);
	pageGo.find('.go').click(function(){
		var goNum = $(this).next().val();
		if(!isNaN(goNum)){
			page_li = dome.find('.nav_pageUl li');
			if(goNum>0 && goNum<=allPg){
				var ckPageFalse = false;

				//获取显示的页码，判断页码的范围
				for (var i = 0; i < page_li.length; i++) {
					var pageTest = parseInt(page_li.eq(i).text());
					if( pageTest ){
						if(goNum == pageTest){
							page_li.eq(i).click();
							ckPageFalse = true;
						}
					}
				}

				if(!ckPageFalse){
					var cknum = 0;
					if( goNum < parseInt(page_li.eq(2).text()) ){
						if(goNum <= minNum){
							for (var i = 1; i < page_li.length-2; i++) {
								page_li.eq(i).text(i+1);
								if(i == goNum-1){
									cknum = i;
								}
							}
							page_li.eq(1).removeClass('xx').addClass('pageList');
						}else{
							var ctPages = Math.floor(goNum-(page_li.length-4)/2);
							for (var i = 2,j = ctPages; i < page_li.length-2; i++,j++) {
								page_li.eq(i).text(j);
								if(j == goNum){
									cknum = i;
								}
							}
						}
						page_li.eq(page_li.length-2).text('...').removeClass('pageList').addClass('xx');
					}else if( goNum > parseInt(page_li.eq(page_li.length-3).text()) ){
						if(goNum > allPg-3){
							
							for (var i = page_li.length - 2, j = allPg-1; i >= 2; i--, j--) {
								page_li.eq(i).text(j);
								if(j == goNum){
									cknum = i;
								}
							}
							page_li.eq(page_li.length-1).removeClass('xx').addClass('pageList');
							if(page_li.eq(2) != 3){
								page_li.eq(1).text('...').removeClass('pageList').addClass('xx');
							}
						}else{
							var ctPages = Math.floor(goNum-(page_li.length-4)/2);
							for (var i = 2, j = ctPages; i < page_li.length-2; i++, j++) {
								page_li.eq(i).text(j);
								if(j == goNum){
									cknum = i;
								}
							}
							page_li.eq(1).text('...').removeClass('pageList').addClass('xx');
						}
					}
					page_li.eq(cknum).click();
				}
				
			}else{
				cm.fnFixedHint("请输入正确的页码范围（1~"+allPg+")");
			}
		}else{
			cm.fnFixedHint("请输入正确的数字！");
		}
	});

	pageGo.find('input').keydown(function(e){
		if(e.keyCode == 13){
			pageGo.find('.go').click();
		}
	})

	//控制显示翻页数目方法
	function pageAt(){
		var pageInfo=dome.find(".nav_page");
		var page_prev=$(".nav_page a.prev"),page_next=$(".nav_page a.next");

		pageInfo.each(function(){
			page_li=$(this).find("ul li");
			pageSe_w=$(this).width()-page_prev.width()*2;         //显示数目区域的宽度
			page_sum=parseInt(pageSe_w/page_li.width());                    //显示的个数
			//console.log('pageSe_w='+pageSe_w+'; page_sum='+page_sum);
			//如果显示数目过多，进行过滤
			if(page_li.length>page_sum){
				page_li.eq(page_li.length-2).text("...").removeClass("pageList").addClass("xx");
				for(var i=page_sum-2;i<page_li.length-2;i++){
					page_li.eq(i).remove();
				}
			}
			page_li.eq(0).addClass("on");  //给第一个显示数目增加样式

			//点击数目翻页
			var click_li=$(this).find("ul li.pageList");
			clickLi(click_li);    //调用数目点击方法

			clickLi($(this).find("ul li.xx")); //需要给这个dom真加click

			//左右按钮翻页
			$(this).find("a.ca").click(function(){ 	
				var onLi=$(this).siblings(".nav_pages").find("ul li.on");
				var seLi=$(this).siblings(".nav_pages").find("ul li");
				if($(this).index()==0){
					if(onLi.index()>0){
						onLi.removeClass('on').prev().addClass('on');
					}
				}else{
					if(onLi.index()<seLi.length-1){
						onLi.removeClass('on').next().addClass('on');
					}
				}
				onLi=$(this).siblings(".nav_pages").find("ul li.on");
				pageContetn(onLi,seLi);  //调用显页码方法
			});
		});
		page_li=pageInfo.find("ul li");
	}

	//调用显页码方法
	var pcinse=0,hasse,iadd;
	function pageContetn(onLi,seLi){
		var lastLi_t = parseInt(seLi.eq(seLi.length-1).text());
		hasse = Math.floor((onLi.siblings().length+1)/2);
		var onLiIdx = onLi.index();
		var addNum = Math.abs(hasse -onLiIdx)
		
		if(pcinse!=onLiIdx && lastLi_t>seLi.length){
			var addLi = '';
			if(onLiIdx < hasse){
				iadd=parseInt(seLi.eq(2).text())-addNum-1;
				if(iadd < 2){
					addNum = addNum - ( 1 - iadd);
					iadd = 1;
				}
				
				seLi.eq(seLi.length-2).text("...").removeClass("pageList").addClass("xx");
				for (var i = 0; i < addNum; i++) {
					iadd++;
					if(iadd == 2){
						seLi.eq(1).text("2").removeClass("xx").addClass("pageList");
						continue;
					}
					seLi.eq(seLi.length-3-i).remove();
					addLi += '<li class="pageList">'+iadd+'</li>';
				}
				seLi.eq(1).after(addLi);
					
			}else{
				iadd=parseInt(seLi.eq(seLi.length-3).text());
				
				seLi.eq(1).text("...").removeClass("pageList").addClass("xx");
				for (var i = 0; i < addNum; i++) {
					iadd++;
					if(iadd == lastLi_t-1){
						seLi.eq(seLi.length-2).text(iadd).removeClass("xx").addClass("pageList");
						break;
					}
					seLi.eq(2+i).remove();
					addLi += '<li class="pageList">'+iadd+'</li>';
				}
				seLi.eq(seLi.length-3).after(addLi);
				
			}
			//从新加载<li>的 demo 来进行点击监听
			var click_li=seLi.parent('ul').children('li.pageList');
			clickLi(click_li);      //调用数目点击方法
			pageTo(onLi.text(),onLi.parents('.list').attr('id'));  //调用翻页方法
		}else{
			pageTo(onLi.text(),onLi.parents('.list').attr('id'));  //调用翻页方法
		}	
		pcinse=onLi.index();
	}

	//数目点击方法
	var seFalse=false;
	function clickLi(click_li){
		click_li.unbind("click");
		click_li.click(function(){
			if($(this).text()!='...'){
				var ikOnIdx = $(this).siblings('.on').index()
				$(this).addClass('on').siblings().removeClass('on');
				var seLi=$(this).parent('ul').children('li');
				var lastLi_t=Math.floor(seLi.eq(seLi.length-1).text());

				if(lastLi_t>seLi.length){
					if($(this).index()==0&&seFalse==false){
						pageTo($(this).text(),$(this).parents('.list').attr('id'));//调用翻页方法

						for(var i=1;i<seLi.length-2;i++){
							seLi.eq(i).text(i+1);
						}
						seLi.eq(seLi.length-2).text('...').removeClass("pageList").addClass("xx");
						seLi.eq(1).text('2').removeClass("xx").addClass("pageList");

						seFalse=true;
						setTimeout(function(){
							seFalse=false;
						},200);
					}else if($(this).index()==seLi.length-1&&seFalse==false){
						var ces=parseInt(seLi.eq(seLi.length-1).text());
						pageTo($(this).text(),$(this).parents('.list').attr('id'));//调用翻页方法

						seLi.eq(1).text('...').removeClass("pageList").addClass("xx");
						seLi.eq(seLi.length-2).text(ces-1).removeClass("xx").addClass("pageList");
						ces-=seLi.length-2;
						for(var i=2;i<seLi.length-2;i++){
							ces++;
							seLi.eq(i).text(ces);
						}

						seFalse=true;
						setTimeout(function(){
							seFalse=false;
						},200);
					}else{
						if(seFalse==false){
							pageContetn($(this), seLi, ikOnIdx);  //调用显页码方法

							seFalse=true;
							setTimeout(function(){
								seFalse=false;
							},200);
						}					
					}
				}else{
					pageTo($(this).text(),$(this).parents('.list').attr('id'));//调用翻页方法
				}
			}
		});
	}

	//翻页方法
	var pageIo=1;
	function pageTo(page,parentId){
		if(pageIo==page) return;
		pageIo=page;
		//console.log('type='+type+'~thisPage='+page+'~parentId='+parentId);
		if(dataAr){
			if(dataAr instanceof Array){
				cellback(dataAr[page-1]);
			}else{
				cellback(page,dataAr);
			}
		}else{
			cellback(page);
		}
	}
}

