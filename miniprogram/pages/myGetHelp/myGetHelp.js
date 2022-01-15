const db = wx.cloud.database()
var app = getApp();
Page({
    data: {
        openid:"",
        getHelpArray:[],
        wechatUserInfo:{},
        hintFlag:true,
        deleteid:''
    },

    onLoad: function () {
        var that = this
        wx.getSetting({
            success: function(res){
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: function(res) {
                    that.setData({
                        wechatUserInfo:res.userInfo
                  });
                  }
                })
                //that.checkFlag();
              }
            }
          });

    },
   
    onReady: function () {    
        this.fetchData();
    },
   
    //获取数据
    fetchData:function(){
        var that = this;
        console.log('用户名:',app.globalData.userInfo)
        db.collection('xuanshang').where({
            userId:app.globalData.userInfo.nickName
        }).get().then(res => {
            console.log('我的求助:',res.data)
            if (res.data.length == 0){
                        that.setData({
                            hintFlag:false,
                            getHelpArray:res.data
                        });
                  }
                  else{
                      that.setData({
                          hintFlag:true,
                          getHelpArray:res.data
                      });
                  }
          })
    },


    //确认要Ta帮忙
    letHelpYes:function(e){
        var that=this;
        db.collection('xuanshang').doc(this.data.getHelpArray[e.target.id]._id).update({
            data:{
              condition:2,
              isfinished:1
            },
            success: function(resp) {
                        wx.showModal({
                            title: '提示',
                            content: '确认要Ta帮忙成功！',
                            success: function(res) {
                              if (res.confirm) {
                                that.fetchData();
                              }
                            }         
                        });  
                    }
        })  
        
    },

    //确认不要Ta帮忙
    letHelpNo:function(e){
        var that=this;
        db.collection('xuanshang').doc(this.data.getHelpArray[e.target.id]._id).update({
            data:{
              condition:0,
              helperid:''
            },
            success: function(resp) {
                        wx.showModal({
                            title: '提示',
                            content: '不要Ta帮忙成功！',
                            success: function(res) {
                              if (res.confirm) {
                                that.fetchData();
                              }
                            }         
                        });
                    }
        })  
        
    },

    deletehelp:function(event){
      var that=this
      console.log(event.currentTarget.dataset.id)
      wx.showModal({
        title: '提示',
        content: '确认取消帮助？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.delete(event.currentTarget.dataset.id)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    delete:function(deleteid1){
      db.collection('xuanshang').doc(deleteid1).remove(
        {success:function(res)
        {
          wx.showToast({
            title: '求助删除成功',
          })
          setTimeout(function(){
          wx.reLaunch({
            url:"../myGetHelp/myGetHelp"
        })},2000);
        }}
      )
    },
    //确认已经完成了帮助
    confirmFinish:function(e){
        var that=this;
        db.collection('xuanshang').doc(this.data.getHelpArray[e.target.id]._id).update({
            data:{
                condition:3,
                isfinished:2
            },
            success: function(resp) {
                        wx.showModal({
                            title: '提示',
                            content: '给Ta悬赏成功!',
                            success: function(res) {
                              if (res.confirm) {
                                that.fetchData();
                              }
                            }     
                        });

                    }
        }) 
 
    },


})