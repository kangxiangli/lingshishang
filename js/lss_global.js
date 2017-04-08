//域名
var host = 'http://api.0-fashion.com';
//var host = 'http://11.1.1.111:9999'
//$(function(){
//       //动态加载脚本        
//  //LSShang.dynamicScript();   
//  //LSShang.onloadScript();  
//   
//  
//
// })  

var LSShang = new Object();
//LSShang.ready = mui.plusReady;

  
//动态加载外部插件
LSShang.dynamicScript = function (){
    $.each($('.dynamicScript'),function(){            
       $(this).attr('src',$(this).attr('data-src'));
   })       
}
//加载依赖脚本
LSShang.onloadScript = function (){
    var loaded = 0;
    var scriptlen = $('.dynamicScript').length;
    $.each($('.dynamicScript'),function(i,obj){
        $('.dynamicScript')[i].onload = $('.dynamicScript')[i].onreadystatechange = function(){                
            loaded++;
            if(loaded == scriptlen){                  
                $('.dynamicLoadedjs').attr('src',$('.dynamicLoadedjs').attr('data-src'));
            }
        };           
    })    
}  


//加载动画
LSShang.loadAnimate = function(obj,eleID){
    //$('head').append('<link href="wgtroot://css/loading/css/loaders.css" rel="stylesheet" />');
    $('head').append('<link href="../../css/loading/css/loaders.css" rel="stylesheet" />');
    $('head').append('<link href="css/loading/css/loaders.css" rel="stylesheet" />');    
    var _LoadingHtml = '<div class="wrapper nano" id='
    if(eleID){
       _LoadingHtml += eleID
    } else{
       _LoadingHtml += 'loading' 
    }
    _LoadingHtml += '><div class="nano-content"><main><div class="nano-items items-list"><div class="nano-item"><div class="item-inner"><div class="item-loader-container"><div class="la-ball-atom la-2x"><div></div><div></div><div></div><div></div></div></div></div></div></div></main></div></div>';
    if(obj){
        $(obj).append(_LoadingHtml);
    }else{
        return _LoadingHtml;
    }           
}
LSShang.removeloadAnimate=function(){
    $('#loading').remove();
}
//toast
LSShang.toast = function(msg, data){
    if( data ){        
        //data.msg = data.msg || null;
        data.align = data.location || 'center';
        data.duration = data.duration || 'short';
        plus.nativeUI.toast( msg, data );//(data.type,data.location,data.msg,data.duration)
    }else {
        plus.nativeUI.toast( msg );//uexWindow.toast(0,5,data,500)      
    }
}

//页面加载完成回调
LSShang.windowOnload = function(fn){
    window.uexOnload = function(type){
        fn();
    } 
} 
// LSShang.getLocStorage = function(key){
    // appcan.locStorage.getVal(key);
// }    
LSShang.setlocStorage = function(data){    
     if(arguments.length != 1){
          window.localStorage.setItem(arguments[0],arguments[1]);
     }else{
         for( var item in data){
             window.locStorage.setItem(item,data[item]);
         }       
     };    
}    
//存储复合值json形式LSShang.setlocStorages（name,{name1:1;name2;2}）
LSShang.setlocStorages = function(key,data){    
    var  locStorages = '';
    for (var item in data){
        locStorages+= item  + '=' + data[item] + '%lss%';        
    }
    window.localStorage.setItem(key,locStorages);
}
LSShang.getlocStorage = function(key){    
    return window.localStorage.getItem(key);  
}
LSShang.getlocStorageVal = function(key,name){    
    var values = window.localStorage.getItem(key);
    if(values == null )return;
    var arr = values.split('%lss%');
    for( var i = 0; i < arr.length; i++){
        var this_item_arr = arr[i].split('=');
        if( this_item_arr[0] == name ){
            return this_item_arr[1]
        }
    }
    
}
LSShang.removelocStorage = function(key){
    window.localStorage.removeItem(key); 
}
LSShang.parseQueryString = function(name){
    var url = window.location.href;
    var str = url.split("?")[1];
    var items = str.split("&");
    var result = '';
    var arr= [];
   for(var i=0; i<items.length; i++){
         arr = items[i].split('=');
         if([arr[0]] == name){
             result = arr[1];
         };
   }
  return result;
}


LSShang.reload = function(data){
    var contentBox = document.getElementById(data.id);
    $(contentBox).prepend('<div class="refresh" style="height: 0px;overflow: hidden;color:#FFF;text-align:center;">刷新</div>');
    var touchStart,touchEnd;
    contentBox.addEventListener("touchstart", start,false); 
    contentBox.addEventListener("touchmove",move,false);
    contentBox.addEventListener("touchend", end,false);
    function start (event){
        var touch = event.targetTouches[0]; 
        touchStart = touch.pageY; 
        //event.preventDefault();
    }
    function move (event){
        var touch = event.targetTouches[0]; 
        touchEnd = touch.pageY; 
        var dis = touchEnd - touchStart;//滑动距离
        //console.log(touchEnd)
        if(  dis > 50 && $(contentBox).scrollTop() <= 0 ){
            //向下
            var refreshHeight = dis;
            if(refreshHeight > 200 ){
                refreshHeight = 200
            }
            $('.refresh').css({'height':refreshHeight});
            event.preventDefault();
        }else{
            $('.refresh').css({'height':0});
        };
    }
    function end (event){
        var dis = touchEnd - touchStart;//滑动距离
        //console.log(touchEnd+'end'+ touchStart)
        if( dis > 50 && $(contentBox).scrollTop() <= 0 ){
            //向下
            $('.refresh').html('正在努力加载中..')
            $('.refresh').stop().animate({'height':'20px'},350,function(){
               if(data.fn){
                   data.fn();
               }
               $('.refresh').html('完成');
               setTimeout(function(){
                   $('.refresh').stop().animate({'height':0},function(){
                       $('.refresh').html('下拉刷新')
                   });
               },300)
            });
        }
        touchEnd = 0;
        touchStart = 0;
    }
}
LSShang.dateToString = function(obj){
    //obj:时间对象new Date（）
    var year = obj.getFullYear();
    var month = obj.getMonth() + 1;
    var day = obj.getDate();
    if( month.length <=1 ){
        month = '0' + month
    };
    if( day.length <=1 ){
        day = '0' + day
    }
    return year + '-' +month + '-' + day
}

var lssAjax = new Object();
lssAjax.postJson = function(json){
	mui.ajax(json.url,{
		data:json.data,
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		//headers:{'Content-Type':'application/json'},
		beforeSend:function(){
            if(typeof json.beforeSend == 'function' ){
                json.beforeSend();
            }else if(typeof json.beforeSend == 'object' ){
                $('#loading').remove();
                LSShang.loadAnimate(json.beforeSend);
            }
        },
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			if(json.success)json.success(data);
		},
		complete : function(){
            if(json.complete){json.complete()};
            setTimeout(function(){
                $('#loading').remove();
            },350)
        },
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(type);
		}
	});
}



//创建子窗口
function openChildWindow(html,show){
	if(!plus.webview.defaultHardwareAccelerated()&&parseInt(plus.os.version)>=5){
		//styles.hardwareAccelerated=true;
	}
	var muiWindow = plus.webview.create(html,html,{
		background:'transparent',
		top:'45px',//标题栏默认高度；
        bottom:'50px'//默认为0px，可不定义；
	},{});
	return show?muiWindow.show():muiWindow //返回窗口对象	
}
//创建主窗口
function openNewWin(html,extras){
	var load = plus.nativeUI.showWaiting();
	var muiWindow = plus.webview.create(html,html,{background:'transparent'},extras);
	muiWindow.addEventListener("loaded", function() {
		setTimeout(function(){
			plus.webview.show( muiWindow, 'slide-in-right','350')
			load.close();
		},100)//防止页面白屏
	});
}
//关闭自身窗口
function closeWin(){
	var ws=plus.webview.currentWebview();
	plus.webview.close(ws,'auto');
}
//隐藏自身窗口
function hideWin(){
	var ws=plus.webview.currentWebview();
	plus.webview.hide(ws,'auto');
}


//获取窗口对象
function getWebview(id){
	//id为空时获取主窗口
	return id?plus.webview.getWebviewById( id ):plus.webview.getWebviewById( plus.runtime.appid );
}
//指定窗口执行js
function webViewJS(webView,jsStr){
	/*
	* webView：窗口对象；
	* jsStr：执行脚本：alert（）；
	*/
	webView.evalJS(jsStr);
}
//预加载
function preloadWin(html){
	var page = mui.preload({
	    url:html,
	    id:html,//默认使用当前页面的url作为id
	    //styles:{},//窗口参数
	    //extras:{}//自定义扩展参数
	});
	return page;
}

var Webview = {
currentWebview : function(){return plus.webview.currentWebview()},
	getWebview : function(id){
		//id为空时获取主窗口
		return id?plus.webview.getWebviewById( id ):plus.webview.getWebviewById( plus.runtime.appid );
	},
	webViewJS : function(id,jsStr){
	/* webView：窗口对象；jsStr：执行脚本：alert（）；*/
		getWebview(id).evalJS(jsStr);
	}
		
}

//用户ID
//var userId = LSShang.getlocStorageVal('Member','MemberId');
//var userNum = LSShang.getlocStorageVal('Member','U_Num'); 
//调试数据

var userId = "6382";
var userNum = "a8dc9d8744038399";
//MemberId":6382,"U_Num":"a8dc9d8744038399"


	function return_index() {
			var main = plus.webview.getLaunchWebview();
			var view_top = plus.webview.getTopWebview();
			if(view_top.getURL() != main.getURL()) {	
				plus.webview.close(view_top);
			}
			main.setStyle({
				left: '0',
				top: '0',
				bottom: '0',
				mask: 'none',
				transition: {
					duration: 100
				},
				zindex: -9996,
			});
		}
