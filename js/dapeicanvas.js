    appcan.ready(function(){
        setProduct(pruductIndex);
        setBackground(backgroundIndex);
    })
    $('#open_save').click(function(){
        $('.save').slideToggle('fast');
        return false;
    })
    $(document).click(function(){
        $('.save').slideUp();
    })
/*========================================== canvas ============================================*/

    var ImageObjectArr = new Array();
    ImageObjectArr = [0];
    //var imgPositionList = new Array();
    var addBtn = new Object();
    var selectObj=null;   //被选中的canvas对象
    var canvas = new fabric.Canvas('c');   
    var context= canvas.getContext("2d");  
    var devicePixelRatio = window.devicePixelRatio || 1;        //获得当前手机用几个像素渲染一个像素
    var backingStoreRatio = context.webkitBackingStorePixelRatio ||         //像素比
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
                
      //DDR是当前手机和电脑像素比值 (用于把canvas放大到多少倍)
    var DPR = devicePixelRatio / backingStoreRatio;                

    canvas.selection = false;       //防止选择多个图片
    //宽度 ：屏幕的宽度 *百分比
    canvas.renderAll();
    //*DPR的目的就是放大canvas达到canvas渲染按1:1的比例
    var canvasWidth=$('.canvasBox').width();  
    var canvasHeight=canvasWidth;
    
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
   
    //最后在缩小DPR倍的区域，实现大小的控制

    //背景
    canvas.setBackgroundColor('rgba(255, 255, 255,.2)');      
     
    //添加搭配图btn 
    fabric.Image.fromURL('../../img/bg_add@2x.png',function(img){
        img.set({
             left:(canvasWidth/2)-15,
             top: (canvasHeight/2)-15,
             height:30,
             width:30,
             angle:0,
             lockMovementX:true,
             lockMovementY:true,
             hasControls:false,
             hasBorders:false,
             selectable:false,
            })
        canvas.add(img);
        img.bringToFront();
        addBtn = img;
        img.moveTo(0);
        img.type='add_danpin';
     });
     

        
    canvas.on({'mouse:up':function(e){//打开三级页面，选择单品
                if(e.target && e.target.type =='add_danpin'){               
                    $('#pop-up_box').show('1000');
                    $('#close').click(function(){
                    $('#pop-up_box').hide();
                    $('.pageone').removeClass('change_bg');
                   });
                }
            }
        })  
/********************************** 层级关系 **************************************/
    canvas.on('object:selected',function(e){
        var el=e.target;
        selectObj=el;
    }); 
/********************************* click添加图片  ********************************/

    $('#wddp').click(function(){
        LSShang.setlocStorage('toMatch','true');
        openNewWin('todanpin','danpin.html');
        canvas.remove(addBtn);
        $('#pop-up_box').hide();                          
        });
    $('#close').click(function(){
        $('#pop-up_box').hide();
        $('.pageone').removeClass('change_bg');
    });
         //添加图片按钮打开2级页面
    $('.addEle').click(function(){            
        $('#pop-up_box').show('1000');
      
    })
        
/********************************* 上移下移 **********************************/
     $('#shangyi').click(function(){
         //console.log(ImageObjectArr)
         if(selectObj == ImageObjectArr[ImageObjectArr.length-1]){
            LSShang.toast('已到最高层');
            return;
          }
         for (var i =0; i <ImageObjectArr.length; i++) {
              if(selectObj == ImageObjectArr[i]){
                  ImageObjectArr[i].moveTo(i);
                  var item = ImageObjectArr[i+1];
                  ImageObjectArr[i+1] = ImageObjectArr[i];
                  ImageObjectArr[i] = item;
                  break;
              }
         }
     })
     $('#xiayi').click(function(){
         //console.log(ImageObjectArr)
         for (var i =0; i <ImageObjectArr.length; i++) {
            if(selectObj == ImageObjectArr[1]){
                LSShang.toast(' 已经是最底层了');
                return;
            }
            if(selectObj == ImageObjectArr[i]){
                ImageObjectArr[i].moveTo(i-2);
                var item = ImageObjectArr[i-1];
                ImageObjectArr[i-1] = ImageObjectArr[i];
                ImageObjectArr[i]=item;
                break;
            }
        }
    })
          
/************************************ 删除对像 ************************** **********/
    var editDelImageLIst = [];
    $('.remove').click(function(){
        canvas.remove(selectObj);
        for (var i=0;i<ImageObjectArr.length;i++) {
            if(selectObj == ImageObjectArr[i]){
                if(selectObj.status == 'edit'){//编辑时删除已保存零件
                    editDelImageLIst.push(ImageObjectArr[i]);
                }
                ImageObjectArr.splice(i,1);
                break;
            }
        }
        for (var j=0; j<editTextList.length; j++) {
            if(selectObj == editTextList[j]){
                if(selectObj.status == 'edit'){//编辑时删除已保存零件
                    editTextList[j].OperationType = 2;
                }
                console.log(editTextList)
                break;
            }
        }
    })
/********************************* 图像翻转 *************************************/
    $('.fanzhuan').click(function(){
        selectObj.setScaleX(-selectObj.getScaleX()).setCoords();
        canvas.renderAll();
    })
/*限制图片不能超过边界*/
      // canvas.on('object:moving',function(e){
      //   var el=e.target;
      //   var elWidth=el.getBoundingRectWidth();
      //   var elHeight=el.getBoundingRectHeight();
    
      //   el.left=el.left<0?0:el.left;
      //   el.top=el.top<0?0:el.top;
      //   el.left=el.left>canvas.width-elWidth?canvas.width-elWidth:el.left;
      //   el.top=el.top>canvas.height-elHeight?canvas.height-elHeight:el.top;
      // });
     
/*************************************** 添加文字 ***************************************/
    var editTextList = [];
    $('.txt').click(function(){
        //$('.swiper-container').slideUp()
       $('.sucaibox,.back-img').hide();
       if($('.addtxt').is(':hidden')){
           $('.addtxt').show();
       }else{
           $('.addtxt').hide();
       }
    });
    $('.addText').click(function(){
        var txt=$('.text').val();    
        var canText=new fabric.Text(txt, {
            left:100,
            top:100,
            angle:0,
            fill:'rgba(0,0,0,1)',
            fontFamily: "Microsoft YaHei"
        });
        canvas.add(canText);
        canvas.setActiveObject(canText);
        canText.OperationType = 0;
        //canText.setCoords();
        editTextList.push(canText);
        $('.addtxt').hide();
    });     
    $('.text').focus(function(){
        $('.addtxt').addClass('activeaddtxt')
        $('.swiper-container').slideUp()
    })   
    $('.text').focusout(function(){
        $('.addtxt').removeClass('activeaddtxt')
        $('.swiper-container').slideDown()
    }) 
/*************************************** 添加背景 **************************************/
    var backgroundObject = new Object();
    $('.addBackground').click(function(){        
       $('.sucaibox,.addtxt').hide();
       if($('.back-img').is(':hidden')){
           $('.back-img').show();
       }else{
           $('.back-img').hide();
       }
    })
    $('.img-box').on('click','img',function(e){
        e.preventDefault();
        var bgel = e.target;
        var  newBg = new fabric.Image(bgel);
        newBg.ProductId = $(this).attr('data-id');
        newBg.ProductSource = 4;//素材类型
        newBg.Level = 0;//背景层级为0
        backgroundObject = newBg;
        newBg.set('width', canvas.width);
        newBg.set('height',canvas.height);
        canvas.setBackgroundImage(newBg);
        canvas.renderAll();
        canvas.selection = false;
        $('.wu').click(function(){
            canvas.setBackgroundImage(null);
            canvas.renderAll();
            $('.back-img').hide();
        })
        $('.back-img').hide();
    });
        
/*************************************** 素材 **************************************/
    $('.sucai').click(function(){
        $('.back-img,.addtxt').hide();
        if($('.sucaibox').is(':hidden')){
            $('.sucaibox').show();
        }else{
            $('.sucaibox').hide();
        }    
    });

    $('.sucai_img').on('click','img',function(e){
        canvas.remove(addBtn);
        e.preventDefault();
        var selectImg=e.target;
        var newImage = new fabric.Image(selectImg);
        newImage.ProductId = $(this).attr('data-id');
        newImage.ProductSource = 4;//素材类型
        newImage.OperationType = 0;//操作类型（0添加；1修改；2删除；）
        newImage.set({
            left:canvas.getWidth()/2,
            top:canvas.getHeight()/2,
            //angle:0,
            cornerColor:"#AAA",
            borderColor:"#AAA",
            //transparentCorners: false      //控制点大小
            //centeredRotation:true
        });
        newImage.setControlVisible("ml",false);          //去除不需要的控制点
        newImage.setControlVisible("tl",false);
        newImage.setControlVisible("tr",false);
        newImage.setControlVisible("bl",false);
        newImage.setControlVisible("mt",false);
        newImage.setControlVisible("mr",false);
        newImage.setControlVisible("mb",false);
        canvas.add(newImage).setActiveObject(newImage);
        ImageObjectArr.push(newImage);
        canvas.renderAll();
        $('.sucaibox').hide();
    });
    
/*************************************** 锁定 ***************************************/
    $('.lock,.lock img,.lock p').click(function(){
     selectObj.set({
             lockMovementX:true,
             lockMovementY:true,
             hasControls:false,
             hasBorders:true,
             centeredRotation:true
    
            });
    })     
        
/*************************************** 添加单品 *************************************/    
    function setSelectImg(){
        var imgURL = LSShang.getlocStorage('toMatchImg');
       
        var selectedIMG = fabric.Image.fromURL(imgURL, function(img) {
            img.scale(0.5).set({
                left: 150,
                top: 150,
                cornerSize:20,  
                cornerColor:"#AAA",
                borderColor:"#AAA",
                //cornerStyle :'circle'
            });
            img.setControlVisible("ml",false);//去除不需要的控制点
            img.setControlVisible("tl",false);
            img.setControlVisible("tr",false);
            img.setControlVisible("bl",false);
            img.setControlVisible("mt",false);
            img.setControlVisible("mr",false);
            img.setControlVisible("mb",false);
            canvas.add(img).setActiveObject(img);
            img.OperationType = 0;//操作类型（0添加；1修改；2删除；）
            img.ProductId = LSShang.getlocStorage('toMatchImgId');
            LSShang.removelocStorage('toMatchImgId');
            img.ProductSource = 0;//素材类型
            ImageObjectArr.push(img)
        });
        LSShang.removelocStorage('toMatchImg');
    }
/*************************************** 渲染商品素材 **********************************/
var pruductIndex = 1;
var maxPruductIndex = 999;
var backgroundIndex = 1;
var maxBackgroundIndex = 999;
function setProduct(i){
    lssAjax.postJson({
        url: host + '/api/materials/material/getlist',
        data:{
            MemberId:userId,
            U_Num:userNum,
            MaterialType:1,
            PageIndex:i,
            PageSize:10
        },
        success:function(data){
            //console.log(data)
            var html = '';
            if(data.Data.length == 0){
                maxPruductIndex = pruductIndex;
                return;
            }
            $(data.Data).each(function(i,item){
                html += '<img src='+ item.IconPath +' data-id='+ item.MaterialId +' alt="">'
            })
            $('.sucai_img').append(html)
        }
    })
}
function setBackground(i){
    lssAjax.postJson({
        url: host + '/api/materials/material/getlist',
        data:{
            MemberId:userId,
            U_Num:userNum,
            MaterialType:0,
            PageIndex:i,
            PageSize:10
        },
        success:function(data){
            //console.log(data)
            if(data.Data.length == 0){
                maxBackgroundIndex = backgroundIndex;
                return;
            }
            var html = '';
            $(data.Data).each(function(i,item){
                html += '<img src='+ item.IconPath +' data-id='+ item.MaterialId +' alt="">'
            })
            $('.img-box').append(html)
        }
    })
}
function judgeNextPage(obj){
    var dis = obj.position().top;
    return dis;
}
$('.sucaibox').scroll(function(){
    if(pruductIndex == maxPruductIndex ){
        return;
    }
    pruductIndex ++;
    if( judgeNextPage($('.sucai_img img:last')) < 100 ){
        setProduct(pruductIndex);
    }
})
$('.back-img').scroll(function(){
    if(maxBackgroundIndex == backgroundIndex){
        return;
        
    }
    backgroundIndex ++;
    if( judgeNextPage($('.sucai_img img:last')) < 100 ){
        setBackground(backgroundIndex);
    }
})

/*************************************** 保存 ************************************/

//获取位置 
function getPosition(img){
    var role = Math.round(img.getAngle());//角度
    var x_y = img.getCenterPoint();//x+y坐标
    var x = img.getLeft()//x_y.toString().split(',')[0];//x      
    var y = img.getTop()//x_y.toString().split(',')[1];//y
    var width = Math.round(img.getWidth());    //拉伸宽度
    var height = Math.round(img.getHeight());
    img.Frame = '{{'+ x + ', ' + y + '}, {' + width + ', ' + height +'}}'; 
    img.Spin = matrixTotransform(role);
}
//获取图片位置信息
function getImgPositionList(edit){
    var toAddStatus = true;
    if(ImageObjectArr.length <= 1){
        LSShang.toast('请至少添加一张图片');
        toAddStatus = false;
        return false;
    }
    $(ImageObjectArr).each(function(i,item){
        if( i == 0 ) {
            if(!backgroundObject.ProductId){
                LSShang.toast('请添加背景图');
                toAddStatus = false;
                return false;
            }
            ImageObjectArr[0] = {
                Level:backgroundObject.Level,
                ProductId:backgroundObject.ProductId,
                OperationType: 1,
                ProductSource:backgroundObject.ProductSource,
                Frame:'null',
                Spin:'[]'
            }
        }else{
            item.Level = i;
            getPosition(item);
        };
        
    })
    $.each(editDelImageLIst,function(i,item){
        item.OperationType = 2;
    })
    editAllImgList = ImageObjectArr.concat(editDelImageLIst);
    console.log(ImageObjectArr)
    console.log(editDelImageLIst)
    //循环保留所需参数
    var imgPositionList = [];
    $(editAllImgList).each(function(i,item){
        var data = {
            Level:item.Level,
            ProductId:parseInt(item.ProductId),
            ProductSource:item.ProductSource,
            Frame:item.Frame,
            Spin:item.Spin
        }
        if(edit){
            data.OperationType = item.OperationType;
            data.Id = parseInt(item.ProductId);
        }
         imgPositionList.push(data)
    })
    //获取文字
    var textareaList = [];
    $(editTextList).each(function(i,item){
        var json = {};
        json.Text = item.text;
        getPosition(item);
        json.Frame = item.Frame;
        json.Spin = item.Spin;
        json.FontSize = item.fontSize;
        json.Color = item.fill.RGBtocolorIOS();
        //json.Color = item.fill.colorRgb();
       
        if(edit){
            json.OperationType = item.OperationType;
        }
        if(item.Id){
            json.Id = parseInt(item.Id);
        }
        textareaList.push(json);
    })
   console.log(textareaList)
    //console.log(imgPositionList)
    LSShang.setlocStorage('dapeiToSaveTextList',textareaList);
    LSShang.setlocStorage('dapeiToSaveImgList',imgPositionList);
    return toAddStatus;
    
}
//矩阵转角度
function getmatrix(matrix){  
    matrix = matrix.replace(/\[/,'').replace(/\]/,'');
    var arr = [];
    arr = matrix.split(', ');
    var aa=Math.round(180*Math.asin(arr[0])/ Math.PI);  
    var bb=Math.round(180*Math.acos(arr[1])/ Math.PI);  
    var cc=Math.round(180*Math.asin(arr[2])/ Math.PI);  
    var dd=Math.round(180*Math.acos(arr[3])/ Math.PI);  
    var deg=0;  
    if(aa==bb||-aa==bb){  
        deg=dd;  
    }else if(-aa+bb==180){  
        deg=180+cc;  
    }else if(aa+bb==180){  
        deg=360-cc||360-dd;  
    }  
    return deg>=360?deg%360:deg;  
}  
//角度转矩阵
function matrixTotransform(deg){
    var cosVal = Math.cos(deg * Math.PI / 180);
    var sinVal = Math.sin(deg * Math.PI / 180);
    var valTransform = '['+ cosVal.toFixed(6) +', '+ sinVal.toFixed(6) +', '+ (-1 * sinVal).toFixed(6) +', '+ cosVal.toFixed(6) +', 0, 0]'
    return valTransform;
}

/*IOS color转换RGBA */  
String.prototype.colorRGBA = function(){      
    var that = this; 
    var aColor = that.replace(/^\[/,"").replace(/\]$/,"").split(' ');  
    for(var i = 0; i<aColor.length-1; i++){
        aColor[i] = aColor[i] * 255;
    }
    var rgba = 'rgba('+ aColor.join(",") +')'
    console.log(rgba)        
    return rgba;  
};  
/*RGBA转换IOS color */ 
String.prototype.RGBtocolorIOS = function(){      
    var that = this; 
    var aColor = that.replace(/^rgba\(|RGBA\(/,"").replace(/\)/,'').split(","); 
    console.log(aColor)
    for(var i = 0; i<aColor.length-1; i++){
        aColor[i] = aColor[i] / 255;
    }
     var IOScolor = '['+ aColor.join(" ") +']'
    return IOScolor;    
    // return rgba;  
};  
var str = 'rgba(0,0,0,1)'
console.log(str.RGBtocolorIOS())
/*16进制颜色转为RGB格式*/  
String.prototype.colorRgb = function(){  
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 
    var sColor = this.toLowerCase();  
    if(sColor && reg.test(sColor)){  
        if(sColor.length === 4){  
            var sColorNew = "#";  
            for(var i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        //处理六位的颜色值  
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2))/255);    
        }  
        return "[" + sColorChange.join(" ") + " 1]";  
    }else{  
        return sColor;    
    }  
}
//var sHex = "#000";  
//var sRgbColor = sHex.colorRgb();//转为RGB颜色值的方法  


var EDIT = {  
    getData:function(){
        var _this = this;
        var dpId = LSShang.getlocStorage('showDpId');
        lssAjax.postJson({
            url : host + '/api/products/membercollocation/getedit',
            data : {
                MemberId : userId,
                U_Num : userNum,
                ColloId:dpId
            },
            success : function(data) {
                console.log(data)
                var json = data.Data;
                if (data.ResultType == 3) {
                    _this.setBackground(json.BackGroundPath,json.BackGroundId);
                    _this.setImage(json.ImageList,json.TextList);
                }
            }
        })
    },
    setBackground:function(bgImgUrl,id){
        fabric.Image.fromURL(bgImgUrl, function(img) {
           img.ProductId = id;
           img.ProductSource = 4;//素材类型
           img.Level = 0;//背景层级为0
           img.OperationType = 1
           img.set('width', canvas.width);
           img.set('height',canvas.height);
           backgroundObject = img;
           canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
           ImageObjectArr[0] = img;
        });
        
        
    },
    setImage:function(imageList,textList){
        var _this = this;
        var sortImageList = [];
        //console.log(imageList)
        //数组按层级排序
        for (var Level = 1 ;Level <=imageList.length; Level++){
            var LevelIndex = Level;
            $.each(imageList,function(i,item){
                if(item.Level == LevelIndex){
                    sortImageList.push(item);
                    return false;
                };
            })
        }
        //console.log(sortImageList)
        $.each(sortImageList,function(i,item){
            var index = i;
            var deg = getmatrix(item.Spin);         
            fabric.Image.fromURL(item.ImagePath, function(img) {
                img.status = 'edit';
                img.OperationType = 1;
                img.ProductId = item.ProductId;
                //img.Level = item.Level;
                //img.ProductId = id;
                img.ProductSource = item.ProductSource;//素材类型
                var position = _this.getFrame(item.Frame);
                console.log(item)                
                img.set({
                    left: position.x,
                    top: position.y,
                    width:position.width,
                    height:position.height,
                    angle:deg,
                    cornerSize:20,  
                    cornerColor:"#AAA",
                    borderColor:"#AAA",
                    //cornerStyle :'circle'
                });
                img.setControlVisible("ml",false);//去除不需要的控制点
                img.setControlVisible("tl",false);
                img.setControlVisible("tr",false);
                img.setControlVisible("bl",false);
                img.setControlVisible("mt",false);
                img.setControlVisible("mr",false);
                img.setControlVisible("mb",false);
                canvas.add(img).setActiveObject(img);
                ImageObjectArr.push(img);
                if( index == sortImageList.length-1 ){
               
                    _this.setText(textList);
                }
            })
        })
    },
    setText:function(textList){
        var _this = this;
        $.each(textList,function(i,item){
            var deg = getmatrix(item.Spin); 
            var position = _this.getFrame(item.Frame);
            console.log(item)
            var canText = new fabric.Text(item.Text, {
                left:position.x,
                top:position.y,
                angle:deg,
                fill:item.Color.colorRGBA(),//颜色转换RGBA
                fontSize:item.FontSize,
                fontFamily: "Microsoft YaHei"
            });
            canText.status = 'edit';
            canText.Id = item.Id;
            canText.OperationType = 1;
            canvas.add(canText);
            canvas.setActiveObject(canText);
            //canText.setCoords();
            //canText.bringToFront();
            editTextList.push(canText);
            console.log(editTextList)
        })
    },
    getFrame:function(frame){
        var frame = frame.split(', ');
        var x = parseFloat(frame[0].replace(/\{*/,''));
        var y = parseFloat(frame[1].replace(/\{*/,''));
        var width = parseFloat(frame[2].replace(/\{*/,''));
        var height = parseFloat(frame[3].replace(/\{*/,''));        
        var position = {x:x,y:y,width:width,height:height};
        return position;
    },
    
    initData:function(){
        canvas.remove(addBtn);
        this.getData();
    }
    
}



appcan.ready(function(){
   var dpId = LSShang.getlocStorage('showDpId');
   /******************************* 判断新增/编辑 ****************************************/
   if(dpId){
        EDIT.initData();
        //LSShang.removelocStorage('showDpId'); 
        $("#save").on({
            click:function(){
                canvas.discardActiveObject();
                var imageUrl = canvas.toDataURL({
                format: 'png'
            });
            LSShang.setlocStorage('addDpImageBase64',imageUrl);
            LSShang.setlocStorage('showDpId',dpId);
            
            if(getImgPositionList(dpId)){
                openNewWin('addDp','adddapei.html')
            }
        }
    }); 
       
    }else{
       //截图
        $("#save").on({
            click:function(){
                console.log(editTextList)
                canvas.discardActiveObject();
                var imageUrl = canvas.toDataURL({
                format: 'png'
                });
                LSShang.setlocStorage('addDpImageBase64',imageUrl);
                if(getImgPositionList()){
                    openNewWin('addDp','adddapei.html')
                };
            }
        }); 
    }
  
})

//删除编辑OperationType =2;
// var a = [0,1,2]
// a = $.map(a , function(n){
  // return n + 4;
// });
// console.log(a)

//transformMatrix 
