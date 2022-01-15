const db = wx.cloud.database()
var app = getApp();
Page({
  data: {
    wechatUserInfo:{},
    latitude: null,
    longitude: null,
    location:null,
    openId:null,
    nickName:null,
    payScore:null,
    title:"",
    content:"",
    taskId:"",
    markers: [],
    covers: []  
  },
  helpClick:function(){
     var that = this;
     if(that.data.openId!=app.globalData.openid){
        wx.showModal({
          title: '订单确认',
          content: '请尽快与发布者联系！',
          success: function(res) {
            if (res.confirm) {
              that.sendReq();
            }
          }
        })}
      else
      {
        wx.showModal({
          title: '取消自己的求助',
          content: '确认取消？',
          success (res) {
            if (res.confirm) {
              wx.reLaunch({
                url:"../myGetHelp/myGetHelp"
            })
            } else if (res.cancel) {
              
            }
          }
          
        })
        

      }
  },
  sendReq:function(){
    //发送请求
    var that = this;
    var reqData={};
    reqData.taskId=that.data.taskId;
    reqData.helperId=that.data.wechatUserInfo.nickName;
    console.log(that.data.taskId)
    db.collection('xuanshang').doc(this.data.taskId).update({
      data:{
        condition:1,
        helperid:app.globalData.userInfo.nickName
      },

    })
    db.collection('xuanshang').where({
      userId:this.data.nickname
    }).get().then(res => {
      console.log(res.data)
      if (res.data.length != 0){
          wx.navigateTo({
            url: '../helpConfirmed/helpConfirmed?mobile='+res.data[res.data.length-1].mobile
          })
      }
      else{
          wx.showModal({
            title: '提示',
            content: '确认失败',
            success: function(res) {
              if (res.confirm) {
                  console.log('用户点击确定')
              }
            }
          });
      }
    })
    
  },
  onLoad: function () {
    var that = this
    console.log(app.globalData.openid)
  	//调用应用实例的方法获取全局数据
    that.setData({
      latitude: app.mapData.latitude,
      longitude: app.mapData.longitude,
      location: app.mapData.location,
      openId:app.mapData.openID,
      nickName:app.mapData.nickName,
      payScore:app.mapData.payScore,
      title:app.mapData.title,
      content:app.mapData.content,
      taskId:app.mapData.taskId,
      covers:{
        latitude: app.mapData.latitude,
        longitude: app.mapData.longitude,
        iconPath: '../../images/map-location.png',
        rotate: 0
      }
    });
  }
})