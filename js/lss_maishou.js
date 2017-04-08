
        $('.search_img').bind('click',function(){
              $('.search_img').animate({ left:'16%'},100);
              $('.serch_inp').focus();
        })
        
        var flag=true;
        
         $('#show_hide').click(function(){
             if(flag){
                  open_search();
             }else{
                 close_search()
             }
         })
         function open_search(){
              $('#search').animate({ height:'54'},200);
             $('.qiehuan').css('display','block');
              $('.search_products').css('display','block');
              flag=false;
         }
         function close_search(){
              $('#search').animate({ height:'12'},200);
              $('.qiehuan').css('display','none');
              $('.search_products').css('display','none');
              $('.search_img').animate({ left:'46%'},300);
               $('.serch_inp').blur();
              flag=true;
         }
  
  
  
    
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load
    });
    
    function Refresh() {
        setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el = document.querySelector("#wrapper ul");
            //这里写你的刷新代码
            document.getElementById("wrapper").querySelector(".pullDownIcon").style.display = "none";
            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML = "<img class='finish' src='images/ok.png'/>刷新成功";
            setTimeout(function () {
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML = "";
            }, 1000);//模拟qq下拉刷新显示成功效果
            /****remember to refresh after  action completed！ ---yourId.refresh(); ----| ****/
        }, 1000);
    }
    function Load() {
        setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
            getProducts();
            /*var el, li, i;
             el = document.querySelector("#wrapper ul");
             for (i = 0; i < 1; i++) {
             li = document.createElement('li');
             li.innerHTML = '<div><div class="img_box"><img src="img/1.png" alt="png"/>  </div><div class="bt_gray"><p><span class="money"></span>￥10</p> <div class="cloth_sea"><b class="clothing">开衫</b><i class="seasion">夏季</i></div><div class="praise"><div class="praise_box"><img src="images/z.png" alt="png"/>0</div> <div class="info_box"><img src="images/pl.png" alt="png"/>15</div></div></div></div>'
             el.appendChild(li, el.childNodes[0]);
             }*/

            wrapper.refresh();
            /****remember to refresh after action completed！！！   ---id.refresh(); --- ****/
        });
    }

    function getProducts() {
        var param = window.location.search;
        var categoryId = "";
        if (param != null && param != "") {
            var regex = new RegExp('categoryId=\\d*', 'i');
            var keyword = regex.exec(param);
            categoryId = keyword[0].split('=')[1];
        }
        var pageIndex = $("#pageIndex").val();
        var headBox = ' <li><div class="all_info">';
        var footBox = '</div></li>';
        var headGray = '<div class="bt_gray">';
        var footGray = '</div>';
        $.ajax({
            url: "/apiproduct/getlist",
            type: "post",
            data: {PageIndex: pageIndex, CategoryId: categoryId},
            success: function (data) {
                if (data.ResultType == 3) {
                    var entities = data.Data;
                    if (entities == null || entities.length == 0) {
                        return false;
                    }
                    var num = parseInt(pageIndex) + 1;
                    $("#pageIndex").attr('value', num);
                    for (var i = 0; i < entities.length; i++) {
                        var image = entities[i].CoverImagePath;
                        var color = entities[i].ColorPath;
                        var price = entities[i].Price;
                        var category = entities[i].CategoryName;
                        var season = entities[i].SeasonName;
                        var jumpLink = entities[i].JumpLink;
                        var img = '<div class="img_box"><a class="single" href="' + jumpLink + '"><img src="' + image + '" alt="img"></a></div>';
                        var p = '<p><img class="money" src="' + color + '">￥' + price + '</p>';
                        var sea = '<div class="cloth_sea"><b class="clothing">' + category + '</b><i class="seasion">' + season + '</i></div>';
                        var temp = '<div class="praise"><div class="praise_box"><img src="/Content/Images/Template/Image/z.png" alt="png">0</div><div class="info_box"><img src="/Content/Images/Template/Image/pl.png" alt="png">15</div></div>';
                        var html = headBox + img + headGray + p + sea + temp + footGray + footBox;
                        $("ul").append(html);
                    }
                } else {
                    return false;
                }
            }
        })
    }