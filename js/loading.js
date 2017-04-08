    
    //动态加载css
    document.write('<link rel="stylesheet" href="../../css/loaderCss/loading.css" type="text/css" />');
    
    //呈现loading效果  
    var _LoadingHtml = '<div class="loadContainer" id="loading"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'
    //document.write(_LoadingHtml);     
    
    //监听加载状态改变
    document.onreadystatechange = completeLoading;     
    
    //加载状态为complete时移除loading效果
    function completeLoading() {
        if (document.readyState == "complete") {
            var loadingDOM = document.getElementById('loading');                
         //   loadingDOM.parentNode.removeChild(loadingDOM);
        }
    }
