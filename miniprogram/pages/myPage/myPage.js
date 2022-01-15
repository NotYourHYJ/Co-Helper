var app = getApp();
const db = wx.cloud.database()
Page({
    data: {
        wechatUserInfo: {},
        userInfo:{},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        credit:1000,    //积分
    },

    onLoad: function () {
        //调用应用实例的方法获取全局数据
        console.log(app.globalData.userInfo)
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
       
    },
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.fetchCredit()  
    },
    onReady: function () {
      if(app.globalData.userInfo){
        this.fetchCredit()
      }
    },

    onShow:function(){
      if(app.globalData.userInfo){
        this.addCredit()
        this.minusCredit()
      }
 
    },
    fetchCredit:function(){
      db.collection('account').where({
        userId:this.data.userInfo.nickName
      }).get().then(res => {
        if(res.data.length==0){
          // 开户
          db.collection('account').add({
            data:{
              userId:this.data.userInfo.nickName,
              credit:1000
            }
          })
        }
        else{
          this.setData({
            credit:res.data[0].credit
          })
        } 
        })

    },
    minusCredit:function(){
      var length=0;
      // 扣除积分
      db.collection('xuanshang').where({
        isfinished:2,
        userId:this.data.userInfo.nickName
      }).get().then(res => {
        while(length!=res.data.length){
            this.setData({
              credit:Number(this.data.credit)-Number(res.data[length].srvCost)
            })
            db.collection('xuanshang').doc(res.data[length]._id).update({
              data:{
                isfinished:3
              },
            })
            length++;
        }
        db.collection('account').where({
          userId:this.data.userInfo.nickName
        }).get().then(resp => {
          db.collection('account').doc(resp.data[0]._id).update({
            data:{
              credit:this.data.credit
            },
          })
          })
        })
    },
    addCredit:function(){
      db.collection('account').where({
        userId:this.data.userInfo.nickName
      }).get().then(res => {
          this.setData({
            credit:res.data[0].credit
          }) 
        })

      var length=0;
      // 获得积分
      db.collection('xuanshang').where({
        isfinished:3,
        helperid:this.data.userInfo.nickName
      }).get().then(res => {
        while(length!=res.data.length){
            this.setData({
              credit:Number(res.data[length].srvCost)+Number(this.data.credit)
            })
            db.collection('xuanshang').doc(res.data[length]._id).update({
              data:{
                isfinished:4
              },
            })
            length++;
        }
        db.collection('account').where({
          userId:this.data.userInfo.nickName
        }).get().then(resp => {
          db.collection('account').doc(resp.data[0]._id).update({
            data:{
              credit:this.data.credit
            },
          })
          })
        })
    },

    
    //跳转页面
    myToHelpPage:function(){
        wx.navigateTo({
             url: '../myToHelp/myToHelp'
        })
    },
    
    myGetHelpPage:function(){
        wx.navigateTo({
             url: '../myGetHelp/myGetHelp'
        })
    }
})