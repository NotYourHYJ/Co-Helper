//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'mycloud-oye0h',
        traceUser: true,
      })
      this.getOpenid()
      
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
         that.globalData.openid=res.result.openid
      }
    })
  },

  //保存用户信息
  globalData:{
    userInfo:null,
    openid:''
  },
  
  // mockHelpList:[
  //   {
  //     latitude: 23.099794,
  //     longitude: 113.324520,
  //     posDes:"上海市人民广场",
  //     picUrl: '../../images/bg01.jpg',
  //     userId:"阿大",
  //     userUrl:"../../images/img01.jpg",
  //     srvDistance:2,
  //     srvTitle:"求帮忙去快递",
  //     srvDesc:"如题，求帮忙去快递如题，求帮忙去快递如题，求帮忙去快递如题，求帮忙去快递如题，求帮忙去快递如题，求帮忙去快递如题，求帮忙去快递~谢谢啦",
  //     srvCost:500,
  //     taskId:"00001"

  //   }, {
  //     latitude: 31.2398060000,
  //     longitude: 121.6695800000,
  //     posDes:"上海市浦东新区顾唐路1699号",
  //     picUrl: '../../images/bg02.jpg',
  //     userId:"阿二",
  //     userUrl:"../../images/img02.jpg",
  //     srvDistance:3,
  //     srvTitle:"求带材料去总部",
  //     srvDesc:"求带材料去总部~谢谢啦",
  //     srvCost:1000,
  //     taskId:"00002"
  //   },
  //   {
  //     latitude: 23.099794,
  //     longitude: 113.324520,
  //     posDes:"上海迪士尼乐园",
  //     picUrl: '../../images/bg01.jpg',
  //     userId:"阿三",
  //     userUrl:"../../images/img01.jpg",
  //     srvDistance:2,
  //     srvTitle:"求拼车去地铁站",
  //     srvDesc:"如题，大家快快行动起来~",
  //     srvCost:500,
  //     taskId:"00003"

  //   }, {
  //     latitude: 31.2398060000,
  //     longitude: 121.6695800000,
  //     posDes:"上海唐镇地铁站",
  //     picUrl: '../../images/bg02.jpg',
  //     userId:"阿二",
  //     userUrl:"../../images/img02.jpg",
  //     srvDistance:3,
  //     srvTitle:"求介绍附近靠谱的房子~",
  //     srvDesc:"本人由于近期要来这里工作，所以需要租个房子。。。",
  //     srvCost:1000,
  //     taskId:"00004"
  //   }
  // ],
  // mapData:{
  //   latitude: null,
  //   longitude: null,
  //   openID:"",
  //   nickName:"",
  //   payScore:null,
  //   title:"",
  //   content:"",
  //   taskId:""
  // },
  // mockUserInfo:{
  //   userId:"mockUser1",
  //   userName:"Horizon",
  //   mobile:"12345678912",
  //   usePoint:"1000",
  //   avatarUrl:""
  // },
  // mockGetHelpArray:[
  //   {
  //     taskId:"001",
  //     srvTtitle:"取快递",
  //     srvDesc:"正在开会，帮忙到1699号大门取快递！",
  //     srvType:"01",
  //     startTime:"34",
  //     endTime:"",
  //     srvCost:"50",
  //     helplerId:"xczheng",
  //     processInfo:"0"
  //   },
  //   {
  //     taskId:"002",
  //     srvTtitle:"带文件",
  //     srvDesc:"求带文件到总部！",
  //     srvType:"02",
  //     startTime:"",
  //     endTime:"",
  //     srvCost:"50",
  //     helplerId:"xczheng",
  //     processInfo:"1"
  //   },
  //   {
  //     taskId:"003",
  //     srvTtitle:"租房",
  //     srvDesc:"求租房！",
  //     srvType:"03",
  //     startTime:"",
  //     endTime:"",
  //     srvCost:"50",
  //     helplerId:"zhanghao",
  //     processInfo:"2"
  //   },
  //   {
  //     taskId:"004",
  //     srvTtitle:"其他",
  //     srvDesc:"其他求助！",
  //     srvType:"99",
  //     startTime:"",
  //     endTime:"",
  //     srvCost:"50",
  //     helplerId:"zhanghao",
  //     processInfo:"3"
  //   }
  // ],
  // mockToHelpArray:[
  //   {
  //     taskId:"001",
  //     userId:"zhanghao",
  //     srvTtitle:"取快递",
  //     srvDesc:"正在开会，帮忙到1699号大门取快递！",
  //     srvType:"01",
  //     mobile:"12345678912",
  //     srvCost:"50",
  //     processInfo:"1",
  //     posDes:"顾唐路1699号"
  //   },
  //       {
  //     taskId:"002",
  //     userId:"zhanghao",
  //     srvTtitle:"带文件",
  //     srvDesc:"求带文件到总部！",
  //     srvType:"02",
  //     mobile:"12345678912",
  //     srvCost:"50",
  //     processInfo:"2",
  //     posDes:"顾唐路1699号"
  //   },
  //   {
  //     taskId:"003",
  //     userId:"zhanghao",
  //     srvTtitle:"租房",
  //     srvDesc:"求租房！",
  //     srvType:"03",
  //     mobile:"12345678912",
  //     srvCost:"50",
  //     processInfo:"3",
  //     posDes:"顾唐路1699号顾唐路1699号顾唐路1699号顾唐路1699号顾唐路1699号顾唐路1699号顾唐路1699号顾唐路1699号"
  //   }
  // ]
})
