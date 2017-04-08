/**
 * 
 */
 window.onload=function(){
    CalendarHandler.initialize();
    getStyle(LSShang.dateToString(new Date()))
    
}
        var today = new Date();         
        today.setDate(today.getDate()+1);
           

function getStyle(date){
    lssAjax.postJson({
        url: host + '/api/products/membercollocation/getcollocation',
        data:{
            MemberId:userId,
            U_Num:userNum,
            Type:1,
            Date:date,
            
        },
        success:function(data){
            console.log(data)
            if(data.ResultType == 3){
                styleDate = data;
                CalendarHandler.detailsshow(data);
            }
        }
    })  
}
//var styleDate = [];
var CalendarHandler = {
    currentYear: 0,
    currentMonth: 0,
    isRunning: false,
    showYearStart:2009,
    tag:0,
    active:0,
    select_index:0,
    initialize: function() {
        $calendarItem = this.CreateCalendar(0, 0, 0);
        $("#Container").append($calendarItem);
        $(".week").css("height",$(".week").width()/7+ "px");
        $(".week>h3").css("line-height",$(".week").width()/7+ "px");
        $("#context").css("height",($(".week").width() +20) + "px");
        $("#center").css("height", $("#context").height() - $(".week").height() + "px");
        $("#selectYearDiv").css("height", $("#context").height() - 50 + "px").css("width", $("#context").width() + "px");
        $("#selectMonthDiv").css("height", $("#context").height() - 50 + "px").css("width", $("#context").width() + "px");
        //$("#centerCalendarMain").css("height", $("#context").height() + "px").css("width", $("#context").width() + "px");

        //$calendarItem.css("height", $("#context").height() - 50 + "px"); //.css("visibility","hidden");
        //$("#Container").css("height", "0px").css("width", "0px").css("margin-left", $("#context").width() / 2 + "px").css("margin-top", ($("#context").height() - 30) / 2 + "px");
        $("#Container").animate({
            width: $("#context").width() + "px",
            //height: ($("#context").height() - 50) * 2 + "px",
            marginLeft: "0px",
            marginTop: "0px"
        }, 300, function() {
            $calendarItem.css("visibility", "visible");
        });
        $(".dayItem").css("width", $("#context").width() + "px");
        var itemPaddintTop = $(".dayItem").height() / 6;
        $(".item").css({
            "width": $(".week").width() / 7 + "px",
            "line-height": $(".week").width() / 7 + "px",
            "height": $(".week").width() / 7 + "px",
        });
        
        //$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
        $(".week>h3").css("width", $(".week").width() / 7 + "px");
        //this.RunningTime();
        //CalendarHandler.detailsshow();
    },
    CreateSelectYear: function(showYearStart) {
        // if($('.dayItem').find('.addclose')){
            // $('.dayItem').find('.addclose').remove();
        // }
        CalendarHandler.showYearStart=showYearStart;
        $(".currentDay").show();
        $("#selectYearDiv").children().remove();
        var yearindex = 0;
        for (var i = showYearStart; i < showYearStart+12; i++) {
            yearindex++;
            if(i==showYearStart){
                $last=$("<div>往前</div>");
                $("#selectYearDiv").append($last);
                $last.click(function(){
                    CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart-10);
                });
                continue;
            }
            if(i==showYearStart+11){
                $next=$("<div>往后</div>");
                $("#selectYearDiv").append($next);
                $next.click(function(){
                    CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart+10);
                });
                continue;
            }

            if (i == this.currentYear) {
                $yearItem=$("<div class=\"currentYearSd\" id=\"" + yearindex + "\">" + i + "</div>")

            }
            else{
                $yearItem=$("<div id=\"" + yearindex + "\">" + i + "</div>");
            }
            $("#selectYearDiv").append($yearItem);
            $yearItem.click(function(){
                $calendarItem=CalendarHandler.CreateCalendar(Number($(this).html()),1,1);
                $("#Container").append($calendarItem);
                CalendarHandler.CSS()
                CalendarHandler.isRunning = true;
                $($("#Container").find(".dayItem")[0]).animate({
                    height: "0px"
                }, 300, function() {
                    $(this).remove();
                    CalendarHandler.isRunning = false;
                });
                $("#centerMain").animate({
                    marginLeft: -$("#center").width() + "px"
                }, 500);
            });
            if (yearindex == 1 || yearindex == 5 || yearindex == 9) $("#selectYearDiv").find("#" + yearindex);
            if (yearindex == 4 || yearindex == 8 || yearindex == 12) $("#selectYearDiv").find("#" + yearindex);

        }
        $("#selectYearDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
        $("#centerMain").animate({
            marginLeft: "0px"
        }, 300);
    },
    CreateSelectMonth: function() {
        if($('.dayItem').find('.addclose')){
            $('.dayItem').find('.addclose').remove();
        }
        $(".currentDay").show();
        $("#selectMonthDiv").children().remove();
        for (var i = 1; i < 13; i++) {
            if (i == this.currentMonth) $monthItem=$("<div class=\"currentMontSd\" id=\"" + i + "\">" + i + "月</div>");
            else  $monthItem=$("<div id=\"" + i + "\">" + i + "月</div>");
            $("#selectMonthDiv").append($monthItem);
            $monthItem.click(function(){
                $calendarItem=CalendarHandler.CreateCalendar(CalendarHandler.currentYear,Number($(this).attr("id")),1);
                $("#Container").append($calendarItem);
                CalendarHandler.CSS()
                CalendarHandler.isRunning = true;
                $($("#Container").find(".dayItem")[0]).animate({
                    height: "0px"
                }, 300, function() {
                    $(this).remove();
                    CalendarHandler.isRunning = false;
                });
                $("#centerMain").animate({
                    marginLeft: -$("#center").width() + "px"
                }, 500);
            });
            if (i == 1 || i == 5 || i == 9) $("#selectMonthDiv").find("#" + i);
            if (i == 4 || i == 8 || i == 12) $("#selectMonthDiv").find("#" + i);
        }
        $("#selectMonthDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
        $("#centerMain").animate({
            marginLeft: -$("#center").width() * 2 + "px"
        }, 300);
    },
    IsRuiYear: function(aDate) {
        return (0 == aDate % 4 && (aDate % 100 != 0 || aDate % 400 == 0));
    },
    CalculateWeek: function(y, m, d) {
        var arr = "7123456".split("");
        with(document.all) {
            var vYear = parseInt(y, 10);
            var vMonth = parseInt(m, 10);
            var vDay = parseInt(d, 10);
        }
        var week =arr[new Date(y,m-1,vDay).getDay()];
        return week;
    },
    CalculateMonthDays: function(m, y) {
        var mDay = 0;
        if (m == 0 || m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
            mDay = 31;
        } else {
            if (m == 2) {
                //判断是否为芮年
                var isRn = this.IsRuiYear(y);
                if (isRn == true) {
                    mDay = 29;
                } else {
                    mDay = 28;
                }
            } else {
                mDay = 30;
            }
        }
        return mDay;
    },
    CreateCalendar: function(y, m, d) {        
        $dayItem = $("<div class=\"dayItem\"></div>");
        //获取当前月份的天数
        var nowDate = new Date();
        if(y==nowDate.getFullYear()&&m==nowDate.getMonth()+1||(y==0&&m==0))
            $(".currentDay").hide();
        var nowYear = y == 0 ? nowDate.getFullYear() : y;
        this.currentYear = nowYear;
        var nowMonth = m == 0 ? nowDate.getMonth() + 1 : m;
        this.currentMonth = nowMonth;
        var nowDay = d == 0 ? nowDate.getDate() : d;
        $(".selectYear").html(nowYear + "年");
        $(".selectMonth").html(nowMonth + "月");
        var nowDaysNub = this.CalculateMonthDays(nowMonth, nowYear);
        //获取当月第一天是星期几
        //var weekDate = new Date(nowYear+"-"+nowMonth+"-"+1);
        //alert(weekDate.getDay());
        var nowWeek = parseInt(this.CalculateWeek(nowYear, nowMonth, 1));
        //nowWeek=weekDate.getDay()==0?7:weekDate.getDay();
        //var nowWeek=weekDate.getDay();
        //获取上个月的天数
        var lastMonthDaysNub = this.CalculateMonthDays((nowMonth - 1), nowYear);

        if (nowWeek != 0) {
            //生成上月剩下的日期
            for (var i = (lastMonthDaysNub - (nowWeek - 1)); i < lastMonthDaysNub; i++) {
                $dayItem.append("<div class=\"item lastItem\">" + (i + 1) + "</div>");
            }
        }
        function addZ(z){
           z = '' + z;
           if(z.length == 1 ){
               
            z = '0'+ z
            } 
            return z;
        }
        //alert(addZ(1))
        var dateStr = nowYear +'-'+ addZ(nowMonth) + '-';
        //生成当月的日期
        for (var i = 0; i < nowDaysNub; i++) {
            if (i == (nowDay - 1)) $dayItem.append("<div class=\"item currentItem\" data-day="+ dateStr+addZ(i+1) +">" + (i + 1) + "</div>");
            else $dayItem.append("<div class=\"item\" data-day="+ dateStr+addZ(i+1) +">" + (i + 1) + "</div>");
        }

        //获取总共已经生成的天数
        var hasCreateDaysNub = nowWeek + nowDaysNub;
        //如果小于42，往下个月推算
        if (hasCreateDaysNub < 42) {
            for (var i = 0; i <= (42 - hasCreateDaysNub); i++) {
                $dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
            }
        }
        
        return $dayItem;

    },
    CSS: function() {
        var itemPaddintTop = $(".dayItem").height() / 6;
        $(".item").css({
             "width": $(".week").width() / 7 + "px",
            "line-height": itemPaddintTop + "px",
            "height": $(".week").width() / 7 + "px",
        });
        setTimeout(function(){
            getStyle($('.item').eq(6).attr('data-day'));
        },300)
       
      //  $(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
    },
    CalculateNextMonthDays: function() {
        if (this.isRunning == false) {
            $(".currentDay").show();
            var m = this.currentMonth == 12 ? 1 : this.currentMonth + 1;
            var y = this.currentMonth == 12 ? (this.currentYear + 1) : this.currentYear;
            var d = 0;
            var nowDate = new Date();
            if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
            else d = 1;
            $calendarItem = this.CreateCalendar(y, m, d);
            $("#Container").append($calendarItem);//插入日期列表
            this.CSS();
            this.isRunning = true;
            $($("#Container").find(".dayItem")[0]).animate({
                height: "0px"
            }, 100, function() {
                $(this).remove();
                CalendarHandler.isRunning = false;
            
            });
        }
    },
    CalculateLastMonthDays: function() {
        // if($('.dayItem').find('.addclose')){
            // $('.dayItem').find('.addclose').remove();
        // }
        if (this.isRunning == false) {
            $(".currentDay").show();
            var nowDate = new Date();
            var m = this.currentMonth == 1 ? 12 : this.currentMonth - 1;
            var y = this.currentMonth == 1 ? (this.currentYear - 1) : this.currentYear;
            var d = 0;

            if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
            else d = 1;
            $calendarItem = this.CreateCalendar(y, m, d);
            $("#Container").append($calendarItem);
            var itemPaddintTop = $(".dayItem").height() / 6;
            this.CSS();
            this.isRunning = true;
            $($("#Container").find(".dayItem")[0]).animate({
                height: "0px"
            }, 100, function() {
                $(this).remove();
                CalendarHandler.isRunning = false;
            });
        }
    },
    CreateCurrentCalendar: function() {
        // if($('.dayItem').find('.addclose')){
            // $('.dayItem').find('.addclose').remove();
        // }
        if (this.isRunning == false) {
            $(".currentDay").hide();
            $calendarItem = this.CreateCalendar(0, 0, 0);
            $("#Container").append($calendarItem);
            this.isRunning = true;
            $($("#Container").find(".dayItem")[0]).animate({
                height: "0px"
            }, 300, function() {
                $(this).remove();
                CalendarHandler.isRunning = false;

            });
            this.CSS();
            $("#centerMain").animate({
                marginLeft: -$("#center").width() + "px"
            }, 500);

        }
    },
     detailsshow: function (style) {
        $(style.Data).each(function(i,item){
            var styleDate = item.CollocationTime;
            //alert(styleDate)
            var $date = $('.item[data-day='+ styleDate +']');
            var targetInidex = -1;
            //alert(parseInt($date.index()/7))
            
            if(parseInt($date.index()/7)  == 4){
                targetInidex = 35;
            }else if(parseInt($date.index()/7)  == 3){
                targetInidex = 28;
            }else if(parseInt($date.index()/7)  == 2){
                targetInidex = 21;
            }else if(parseInt($date.index()/7)  == 1){
                targetInidex = 14;
            }
            else if(parseInt($date.index()/7)  == 0){
                targetInidex = 7;
            }   
            //alert($date.index()/7)
            var html = '<div class="clearfix dapeishow" style="background:rgba(255,255,255,.2);float:left;display:none" data-show='+ styleDate +'>'
                             
                       
            var productId = item.ProductId;
            lssAjax.postJson({
                url: host + '/api/products/membercollocation/getcollocationbydate',
                data : {
                    MemberId:userId,
                    U_Num:userNum,
                    ProductId:productId
                },
                success : function(data){
                    console.log(data)
                    html += '<img class="dapeitu" src =' + data.ListCollo.ColloImagePath + '  />' ;
                    $(data.ListCollo.ImagePathList).each(function(a,sitem){
                        //console.log(sitem)
                        html += '<img class="danpin" src =' + sitem + '  />' 
                    })
                    html += '</div>'
                    $('.item').eq(targetInidex).before(html);
                    $('.dapeishow').css({'width':'100%'})
                }
            })
            
           
            $date.append('<img src='+ item.ColorIconPath+' style="width:8px;height:8px;border-radius:50%;position:absolute;top:2px;right:2px" />')
            
        
        })

        $('.item').on('click',function(){
            $('.item').removeClass('active');
            $(this).addClass('active');
            var date = $(this).attr('data-day');
            $('.dapeishow').slideUp();
            $('.dapeishow[data-show='+date+']').slideDown();
        })
  },
    /*RunningTime: function() {
        var mTiming = setInterval(function() {
            var nowDate = new Date();
            var h=nowDate.getHours()<10?"0"+nowDate.getHours():nowDate.getHours();
            var m=nowDate.getMinutes()<10?"0"+nowDate.getMinutes():nowDate.getMinutes();
            var s=nowDate.getSeconds()<10?"0"+nowDate.getSeconds():nowDate.getSeconds();
            var nowTime = h + ":" + m + ":" + s;
            $("#footNow").html("本地时间 "+nowTime);
        }, 1000);

    }*/

}
















