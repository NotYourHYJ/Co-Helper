
const db=wx.cloud.database().collection('xuanshang')
var app = getApp();
Page({
    data:{
        wechatUserInfo:{},
        scrollHeight:150,
        imageWidth:125,
        imageHeight:125,
        photoList:[],
        location:"选择我的位置",
        array: ['拼车','取快递', '带文件', '租房','健身指导', '其他'],
        index: 0,
        date:"2016-09-01",
        time:"12:01",
        curtype: "请选择",
        currentCredit:0
    },
    addAndSavePhoto:function(){
        console.log("从本地选取照片");
        var that = this;
        var showFileList = that.data.photoList;
        wx.chooseImage({
          count: 9, // 最多可以选择的图片张数，默认9
          sizeType: ['original','compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function(res){
            // 后台慢慢保存文件到本地      
            res.tempFilePaths.forEach(function(tempFilePath){
                // 调用保存到本地的API
                wx.saveFile({
                  tempFilePath: tempFilePath,
                  success: function(res){
                    console.log("保存到本地的文件路径："+res.savedFilePath);
                    showFileList.push(res.savedFilePath);
                    // 更新页面显示
                    console.log(showFileList.length+"个展示图片");
                    that.setData({
                        photoList:showFileList
                    });
                  }
                })
            }); 
          }
        });
    },
    previewPhoto:function(event){
        console.log(event);
        var curTarget = event.target.dataset.imageSrc;
        console.log(curTarget);
        wx.navigateTo({
          url: '../previewphoto/previewphoto?imagepath='+curTarget
        });
    },
    twoColomn:function(){
        var that = this;
        var length = 750/2;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    threeColomn:function(){
        var that = this;
        var length = 750/3;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    fourColomn:function(){
        var that = this;
        var length = 750/4;
        that.setData({
            imageWidth:length,
            imageHeight:length
        });
    },
    
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var that = this;
        var i=e.detail.value; 
        that.setData({
        index: i,
            curtype:that.data.array[i]
        });
        console.log("123")
    },
    bindDateChange:function(e){
        this.setData({
            date:e.detail.value
        })
    },

    chooseLocation:function(){
        var that = this;
        wx.chooseLocation({
            type: 'wgs84',
            success: function(res) {
                var latitudeCur = res.latitude;
                var longitudeCur = res.longitude;
                var name = res.name;
                var address = res.address;
                console.log(name);
                that.setData({
                    location:name,
                    latitude:latitudeCur,
                    longitude:longitudeCur
                })
            }
        });
    },
    update:function(){

    },
    onLoad:function(){
        if(app.globalData.userInfo==null){
            wx.showModal({
                title: '提示',
                content: '请先登录！',
                success: function(res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url:"../myPage/myPage"
                        });
                    }
                }
            });
        }
        else{
        var that = this;
        //获取用户信息
        if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } 
        // 获取当前窗口高度，以便设置scrollView的高度
        wx.getSystemInfo({
          success: function(res) {
            console.log(res.model);
            console.log(res.pixelRatio);
            console.log(res.windowWidth);
            console.log(res.windowHeight);
            console.log(res.version);
            that.setData({
                scrollHeight:res.windowHeight/8
            });
          }
        });
        //获取当前时间
        var timeStr =new Date;
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
            }

        function formatTime(time) {
            var hour = time.getHours()
            var minute = time.getMinutes()
            var second = time.getSeconds()
           
            return [hour, minute].map(formatNumber).join(':')
            }

        function formatDate(date) {
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()

            return [year, month, day].map(formatNumber).join('-')
            }

        var dateNow=formatDate(timeStr);
        // var timeNow=formatTime(timeStr);
        that.setData({
                date:dateNow,
                // time:timeNow
            });

        wx.cloud.database().collection('account').where({
        userId:app.globalData.userInfo.nickName
      }).get().then(resp => {
          this.setData({
              currentCredit:resp.data[0].credit
          })
        })    
    }
    },

    formSubmit: function(e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var formData=e.detail.value;     
        var a=formData.phonenumber;  
        if(this.enoughCredit(e)){
        if(formData.title!=""||formData.describe!=""){
        if(this.validatemobile(a)){
        db.add({
            data:{
            userId:app.globalData.userInfo.nickName,
            longitude:that.data.longitude,
            latitude:that.data.latitude,
            srvType:that.data.curtype,
            srvTitle:formData.title,
            srvDesc:formData.describe,
            srvCost:(formData.score==0? "0":formData.score),
            endTime:formData.date+" 00:00:00",
            urgent:formData.isquickly,
            mobile:formData.phonenumber,
            posDes:that.data.location,
            flag:true ,
            helperid:'',  
            condition:0,      
            isfinished:0     //悬赏未完成（0），待完成（1），已完成（2）,积分扣除完成（3）,积分支付完成（4）     
            },
         
            success: function(res) {   
                
                {               
                        wx.showModal({
                            title: '提示',
                            content: '求助信息提交成功！',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.reLaunch({
                                        url:"../helpList/helpList"
                                    });
                                }
                            }
                        });
                    }
                },
            fail: function() {
                wx.showModal({
                    title: '提示',
                    content: '提交失败!',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                });
            }
        });
    }
    else{
        wx.showToast({
            title: '手机号错误',
            icon:'none',
            duration: 1500
           })
    }}
    else{
        wx.showToast({
            title: '内容不完整',
            icon:'none',
            duration: 1500
           })
    }}
    else{
        wx.showToast({
            title: '您的积分不足',
            icon:'none',
            duration: 1500
           })
    }
    },

    enoughCredit:function(e){
            console.log(Number(this.data.currentCredit)-Number(e.detail.value.score))
            if((Number(this.data.currentCredit)-Number(e.detail.value.score))<0){
                return false;
            }else{
                return true;
            } 
    },
    validatemobile: function (s) {
                console.log(s)
                var length = s.length;
                if(length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(s) ) 
                { 
                    return true; 
                }else{ 
                    return false; 
                } 
            
       }
})