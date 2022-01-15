
const db = wx.cloud.database()
var app=getApp();
Page(
  {
  data: {
    wxUserInfo:null,
    latitudeCur:app.globalData.lan,
    longitudeCur:app.globalData.lon,
    typedata: "全部",
    urgent:"false",
    index: 0,
    typearray: ['全部','紧急','拼车','取快递','带文件','租房','健身指导', '其他'],
    array: [],
    hintFlag:true,
    randomColorArr: ["#ff7070", "#EEC900", "#4876FF", "#ff6100",
      "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
      "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
      "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
      "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"]
  },

  openMap: function(e) {
    var infoObj=e.currentTarget.dataset;
    app.mapData.latitude=Number(infoObj.latitude);
    app.mapData.longitude=Number(infoObj.longitude);
    app.mapData.location=infoObj.location;
    app.mapData.nickName=infoObj.nickname;
    app.mapData.openID=infoObj.openid;
    app.mapData.payScore=infoObj.payscore;
    app.mapData.title=infoObj.title;
    app.mapData.content=infoObj.content;
    app.mapData.taskId= infoObj.taskid;
    console.log(e)
    wx.navigateTo({
      url: '../helpDetail/helpDetail'
    })
  },



  onLoad:function(options){
    db.collection('xuanshang').doc('9bf625a55f1013140001de126bca99af').update({
      data: {
        urgent: false
      }
    })
    //获取用户信息
      var that = this;
      wx.getSetting({
        success: function(res){
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(res) {
               
                console.log(res.userInfo)
                that.setData({
                  wxUserInfo:res.userInfo
              });
                //用户已经授权过
              }
            })
            that.checkFlag();
          }
        }
      });
    //定位
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          that.setData({
              latitudeCur:res.latitude,
              longitudeCur:res.longitude
          });
          that.checkFlag();
        }
    });
  },

  checkFlag:function(){
    db.collection('xuanshang').where({
      // _openid:'orm4_5U5BtqBlsp6I4j0nRNjVtLo'
      flag:true
    }).get().then(res => {
      console.log(res.data)
      if (res.data.length == 0){
                  this.setData({
                      hintFlag:false,
                      array:res.data
                  });
            }
            else{
                this.setData({
                    hintFlag:true,
                    array:res.data
                });
            }
      })
  },
  onShow:function(){
    //获取用户信息
    var that = this;
    that.checkFlag();
    //定位
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        that.setData({
            latitudeCur:res.latitude,
            longitudeCur:res.longitude
        });
        that.checkFlag();
      }
    });
  },
  onPullDownRefresh: function() {
    //显示顶部加载图标
    wx.showNavigationBarLoading(),
    //关闭所有页面，跳转页面
    wx.reLaunch({
        url:'../helpList/helpList',//此路径仅为例子
    })
    //消息提示框
    wx.showToast({
        title: ' 努力加载中',
        icon: "loading"
    });
    //模拟加载时间
    setTimeout(function() {
        //停止刷新
        wx.stopPullDownRefresh(),
        //隐藏消息提示框
        wx.hideToast(),
        //隐藏顶部加载图标
        wx.hideNavigationBarLoading()
    }, 1000);

}
  
})