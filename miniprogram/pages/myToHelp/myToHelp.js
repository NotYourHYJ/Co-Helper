const db = wx.cloud.database()
var app = getApp();
Page({
    data: {
        wechatUserInfo:{},
        toHelpArray:[],
        hintFlag:true
    },
    
    onLoad: function () {

    },

    onReady: function () {
        this.fetchData();
    },

    //获取数据
    fetchData:function(){
        var that = this;
        db.collection('xuanshang').where({
            helperid:app.globalData.userInfo.nickName
        }).get().then(res => {
            if (res.data.length == 0){
                        that.setData({
                            hintFlag:false,
                            toHelpArray:res.data
                        });
                  }
                  else{
                      that.setData({
                          hintFlag:true,
                          toHelpArray:res.data
                      });
                  }
          })

    },

})