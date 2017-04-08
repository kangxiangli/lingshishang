/*------------------------- swiper动画 ----------------------------------*/
var one=false; 
var swiper = new Swiper('.swiper-container', {  
    onSlideChangeEnd: function(swiper){
        if(one == true){                         
            $('.swiper-slide').eq(0).addClass('animatePage1');
            $('.swiper-slide').eq(1).removeClass('animatePage2');
            one = false;  
        }else{
            $('.swiper-slide').eq(0).removeClass('animatePage1');
            $('.swiper-slide').eq(1).addClass('animatePage2');
            one = true;
            }
        },
    pagination: '.swiper-pagination',
    paginationClickable: true,
    spaceBetween: 30,
});
   	var flag=true;
 /*--------------------------------------- 经验值动画  --------------------------------*/
   function wode_animate(){
   	var devicePixelRatio = window.devicePixelRatio || 1; //获得当前手机用几个像素渲染一个像素

    $('#jingyanzhi').circleProgress({
        startAngle: -Math.PI / 4 * 2,
        value: .75,
        lineCap: 'round',
        size: 92*devicePixelRatio,
        fill: { color:'#FFFFFF'},
        emptyFill:'rgba(0, 0, 0, 0)',
        thickness:10
    });
   if(flag)$('#jingyanzhi canvas').css('width',$('#jingyanzhi canvas').width()/devicePixelRatio);
       flag=false;
   }
		mui.plusReady(function() {
   /*--------------------------- 渲染用户信息 --------------------------------*/   
if( userId != null && userNum != null){    
    lssAjax.postJson({
        url:host + '/api/Members/MemberInfo/GetMemberName',
        data:{
            MemberId:userId,
            U_Num:userNum
        },
       success:function(data){
            $('.touxiang img').attr('src',data.Data.UserPhoto);
            $('#username').html(data.Data.MemberName);
            $('#usertype').html(data.Data.MemberTypeName);
            $('#score').html(data.Data.Score);
            $('#Balance').html(data.Data.Balance);
            $('#userStore').html(data.Data.StoreName);
       }
    })
}
                               
});

  