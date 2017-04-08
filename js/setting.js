
/*修改头像代码*/
$(function () {
    function toFixed2(num) {
        return parseFloat(+num.toFixed(2));
    }

    $('#cancleBtn').on('click', function () {
        $("#showEdit").fadeOut();
        $('#showResult').fadeIn();
    });

    $('#confirmBtn').on('click', function () {
        //debugger
        $("#showEdit").fadeOut();

        var $image = $('#report > img');
        var dataURL = $image.cropper("getCroppedCanvas");
        var imgurl = dataURL.toDataURL("image/jpeg", 0.5);
        $("#changeAvatar > img").attr("src", imgurl);
        $("#basetxt").val(imgurl);
        $('#showResult').fadeIn();
        TemporaryMedia();
  // lssAjax.postJson({
            // url: "http://www.0-fashion.com/ApiMember/Upload",
            // type: "post",
            // data: { 
                // file: imgurl,
                // MemberId:userId,
                // U_Num:userNum
                // },
            // success: function (data) {
                // alert('ok');
                // console.log(data);
            // }
        // });
     
    });

    function cutImg() {
        $('#showResult').fadeOut();
        $("#showEdit").fadeIn();
        var $image = $('#report > img');
        $image.cropper({
            aspectRatio: 1 / 1,
            autoCropArea: 0.7,
            strict: true,
            guides: false,
            center: true,
            highlight: false,
            dragCrop: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            zoom: -0.2,
            checkImageOrigin: true,
            background: false,
            minContainerHeight: 400,
            minContainerWidth: 300
        });
    }

    function doFinish(startTimestamp, sSize, rst) {
        var finishTimestamp = (new Date()).valueOf();
        var elapsedTime = (finishTimestamp - startTimestamp);
        //$('#elapsedTime').text('压缩耗时： ' + elapsedTime + 'ms');

        var sourceSize = toFixed2(sSize / 1024),
            resultSize = toFixed2(rst.base64Len / 1024),
            scale = parseInt(100 - (resultSize / sourceSize * 100));
        $("#report").html('<img src="' + rst.base64 + '" style="width: 100%;height:100%">');
        cutImg();
    }

    $('#image').on('change', function () {
        var startTimestamp = (new Date()).valueOf();
        var that = this;
        lrz(this.files[0], {
            width: 800,
            height: 800,
            quality: 0.7
        })
            .then(function (rst) {
                //console.log(rst);
                doFinish(startTimestamp, that.files[0].size, rst);
                return rst;
            })
            .then(function (rst) {
                // 这里该上传给后端啦
                // 伪代码：ajax(rst.base64)..

                return rst;
            })
            .then(function (rst) {
                // 如果您需要，一直then下去都行
                // 因为是Promise对象，可以很方便组织代码 \(^o^)/~
            })
            .catch(function (err) {
                // 万一出错了，这里可以捕捉到错误信息
                // 而且以上的then都不会执行

                alert(err);
            })
            .always(function () {
                // 不管是成功失败，这里都会执行
            });
    });
    
   
});



