
/******************************** 颜色风格列表 ***********************************/
appcan.ready(function(){   
    $('.color').on('click',function(){        
        $('#select_yanse').slideDown('fast');
        $('#select_fengge').slideUp('fast');
    });
    $('.fengge').on('click',function(){
        $('#select_yanse').slideUp('fast');
        $('#select_fengge').slideDown('fast');
    });
    $('#guanbi_yanse').on('click',function(){
        $('.color span').html('颜色');
        initProduct('color');
        getProductList(CategoryId);
    });
    $('#guanbi_fengge').on('click',function(){
        $('.fengge span').html('风格');
        initProduct('product');
        getProductList(CategoryId);
    });
    //渲染颜色分类数据
    $('#select_yanse').on('click','.colorlist li img',function(){
        $('.color span').html($(this).next().html());
        initProduct();
        colorId = $(this).parent('li').attr('data-colorId');
        getProductList(CategoryId);
    })
    //渲染风格分类数据
    $('#select_fengge').on('click','.ProductAttr li img',function(){
        $('.fengge span').html($(this).next().html());
        initProduct();
        ProductAttrId = $(this).parent('li').attr('data-ProductAttrId');
        getProductList(CategoryId);
    })
    //关闭分类列表
    function closeSelect(){
       $('#select_yanse').slideUp('fast');
       $('#select_fengge').slideUp('fast');
   }
/*********************************** 颜色分类渲染  *********************************/

        lssAjax.postJson({
            url : host + '/api/properties/color/getlist',
            data:{
                MemberId:userId,
                U_Num:userNum
            },
            success:function(data){
                //console.log(data)
                if( data.ResultType == 3){
                    $.each(data.Data,function(i,item){
                        $('.colorlist').append('<li data-colorid='+item.ColorId+'><img src="'+item.IconPath+'"/><p>'+item.ColorName+'</p></li>')
                    })
                }
            }
        })
/******************************* 风格分类 渲染  ***********************************/

        lssAjax.postJson({
            url : host + '/api/products/productattribute/getlist',
            data:{
                MemberId:userId,
                U_Num:userNum,
                ProductAttrType:1 
            },
            success:function(data){
                //console.log(data)
                if( data.ResultType == 3){
                    $.each(data.Data,function(i,item){
                        $('.ProductAttr').append('<li data-ProductAttrId='+item.ProductAttrId+'><img src="'+item.IconPath+'"/><p>'+item.ProductAttrName+'</p></li>')
                    })
                }
            }
        })     
        
        
//初始请求参数
    var CategoryId = -1;
    var ProductAttrId = -1;
    var pageIndex = 1;
    var colorId = -1;
    var pageSize = 10;  
    var operationType = 0;//单品：0；搭配：1

/*====================================== 搭配页面start ===================================*/

    var DPpage = {
        toMatch:function(){
            $('#product_list').on('click','.oneproduct',function(){
                LSShang.setlocStorage('toMatchImg',$(this).find('.single img').attr('src'));
                LSShang.setlocStorage('toMatchImgId',$(this).attr('data-product-id'));
                uexWindow.evaluateScript('dapeicanvas',0,'setSelectImg()')
                closeWin();
            })
            //LSShang.removelocStorage('toMatch');
        }
        
    }
/*====================================== 搭配页面end ===================================*/
/*====================================== 单品页面start ===================================*/
//单品修改、删除
    var Single = {}
    Single.singleEdit = function(){
        var editingObj;
        $('#main').on('click','.single',function(){
            $('.productEditPop').slideDown();
            editingObj = $(this).parents('.oneproduct');
            var editProductId = $(this).parents('li').attr('data-product-id');
            $('.productId').val(editProductId);
        })
        //关闭
        $('.productEditPop').on('click',function(){
            $('.productEditPop').slideUp();
        })
    
        $('.delProduct').on('click',function(){
            var editProductId = $('.productId').val();
            var requestUrl = host + '/api/products/membersingleproduct/delete';
            lssAjax.postJson({
                url:requestUrl,
                data:{
                    MemberId:userId,
                    U_Num:userNum,
                    ProductId:editProductId,
                    ProductType:0
                },
                success:function(data){
                    if(data.ResultType == 3){
                        LSShang.toast({msg:data.Message,duration:1000})
                        $(editingObj).remove();
                    }
                }
            })
        })
    //单品编辑
        $('.editProduct').click(function(){
            editProduct()
        })
    }
    
     function editProduct(){
         var editProductId = $('.productId').val();
         LSShang.setlocStorage('editDanpinId',editProductId);
         openNewWin('danpinEdit','adddanpin.html')
     }
/*====================================== 单品页面end ===================================*/
/*============================ 判断页面start ================================*/
    if(LSShang.getlocStorage('toMatch') == 'true'){
        //搭配页面
        operationType = 1;
        DPpage.toMatch();
    }else{
        //单品页面
        Single.singleEdit();
    }
/*============================ 判断页面end ================================*/




/*--------------------- 底部swiper --------------------*/
    var danpinCategoryId =  LSShang.getlocStorageVal('danpinCategory','type');
    if(!danpinCategoryId){
        danpinCategoryId = 0;
    }
    var swiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: function(swiper){
            CategoryId = $('.swiper-slide-active').attr('data-type');
            initProduct();
            getProductList(parseInt(CategoryId));//切换完成请求单品
        },
        initialSlide:parseInt(danpinCategoryId),
        pagination: '.swiper-pagination',
        slidesPerView:5,
        spaceBetween: 15,
        freeMode: false,
        loop : true,
        centeredSlides : true,
    });
    //选中分类
    // var danpinCategoryId =  LSShang.getlocStorageVal('danpinCategory','type');
    // if(danpinCategoryId){
          // swiper.slideTo(parseInt(danpinCategoryId) + 5, 800, true);
    // }
    // if(danpinCategoryId == 1){
       // getProductList(); 
    // }
    
/*--------------------- 获取单品数据渲染模板 --------------------*/
    //瀑布流
    function loadProduct(){
       var minHeight = $('.column1').height();
       var minobj = new Object();
       if($('.column1').height() <= minHeight ){
           minHeight = $('.column1').height();
           minobj = $('.column1');
       }
       if($('.column2').height() <= minHeight ){
           minHeight = $('.column2').height();
           minobj = $('.column2');
       }
       if($('.column1').height() == $('.column2').height()){
           minHeight = $('.column1').height();
           minobj = $('.column1');
       }
       return minobj;
   }
    //切换分类初始化容器
    function initProduct(init){
        closeSelect();//关闭颜色、风格下拉列表
        if( init == 'color' ) colorId = -111; //清除color
        if( init == 'product' ) ProductAttrId = -111;//清除ProductAttr
        pageIndex = 1;//初始化页码      
        $('.nodate').remove();//删除提示
        $('.noloaddate').remove();
        $("#product_list .column1,#product_list .column2").empty();//初始化瀑布流容器
    }
    //获取单品数据
    function getProductList(categoryid){
        var  requestProductUrl = '/api/products/membersingleproduct/getalllist';
        var json = {
            MemberId:userId,
            U_Num:userNum,
            //CategoryId:categoryid ,
            OperationType:operationType,
            PageIndex:pageIndex,
        }
        json.CategoryId = categoryid || CategoryId;
        if( colorId >= 0 ){
            json.colorId = colorId;
        }
        if( ProductAttrId >= 0 ){
            json.ProductAttrId = ProductAttrId;
        }
        
        lssAjax.postJson({
            url : host + requestProductUrl,
            data:json,
            beforeSend:$('body'),
            success:function(data){
                console.log(data)
                if(data.ResultType == 3){
                    if(data.List.length == 0 && pageIndex == 1){
                        $('#product_list').append('<div class="nodate">暂无数据</div>');
                        return;
                    }else if(data.List.length < pageSize){
                        if($('.noloaddate').length == 0){
                            $('#product_list').append('<div class="noloaddate">没有更多了，快去创建单品吧~</div>')
                        }
                    }                   
                    $(data.List).each(function(i,item){
                         getProducts(data.List[i]);
                    })
                    pageIndex++;
                } 
            }
        })
    }
    //渲染单品
    function getProducts(entities) {
        var tpl = $('#productTpl').html();
        var fn = _.template(tpl);
        var html = fn(entities);
       $(loadProduct()).append(html);
    }
/*------------------------------ 下拉刷新 ------------------------------*/
LSShang.reload({
    id:'main',
    fn:getProductList
})
   
/*---------------------------- 瀑布流滚动加载  ----------------------------*/    
    var t = 0;
    $('#main').scroll(function(e){
        var p = $('#main').scrollTop();
        if( p > t){
            //向上滚动
            if(judgeNextPage() < 0){
                getProductList(CategoryId);
            }
        }else{
            //向下滚动
        }
        t = p;
    })
    function judgeNextPage(){
        var dis = $('#product_list').height() - $('#main').scrollTop() - $('#main').height();
        return dis;
    }
    
})










