var common = require("../../utils/common.js")

Page({
  // getMyInfo: function(e){
  //   let info = e.detail.userInfo;
  //   console.log(e.detail.userInfo)
  //   this.setData({
  //     isLogin: true,
  //     src: info.avatarUrl,
  //     nickName: info.nickName
  //   })
  // },

  data:{
    isLogin: false,
    src: "/images/my.png",
    nickName: "微信用户",
    editNick: false, 
    newsList: []
  },

  onLoad: function () {
    //读取缓存，刷新页面保留登录状态
    let userInfo = wx.getStorageSync("userInfo")
    let loginFlag = wx.getStorageSync("loginFlag")
    if(loginFlag){
      if(userInfo){
        this.setData({
          isLogin: true,
          src: userInfo.src,
          nickName: userInfo.nickName
        })
      }
    }
    this.loadFavorites()
  },

  //一键登录：直接进入登录状态，先用默认头像、默认昵称
  quickLogin(){
    let userInfo = wx.getStorageSync("userInfo")
    if(userInfo){
      this.setData({
        isLogin:true,
        src: userInfo.src,
        nickName: userInfo.nickName
      })
    }else{
      this.setData({
        isLogin:true
      })
    }
    //登录成功代码处
    wx.setStorageSync("loginFlag", true)
    this.saveUserToStorage()
    this.loadFavorites()
  },

  //点击头像，更换头像
  onChooseAvatar(e){
    this.setData({
      src:e.detail.avatarUrl
    })
    this.saveUserToStorage()
  },

  //点击昵称文字，开启编辑模式
  startEditNick(){
    this.setData({editNick:true})
  },

  //失去焦点保存昵称
  saveNickName(e){
    this.setData({
      nickName:e.detail.value,
      editNick:false
    })
    this.saveUserToStorage()
  },

  //保存用户信息到本地缓存
  saveUserToStorage(){
    let user = {
      src:this.data.src,
      nickName:this.data.nickName
    }
    wx.setStorageSync("userInfo",user)
  },

  //退出登录
  logout(){
    wx.setStorageSync("loginFlag", false)
    wx.showModal({
      title:"提示",
      content:"确定要退出登录吗？",
      success:(res)=>{
        if(res.confirm){
          this.setData({
            isLogin:false,
            src:"/images/my.png",
            nickName:"微信用户",
            editNick:false,
            newsList: []
          })
          wx.showToast({title:"已退出登录"})
        }
      }
    })
  },

  //加载收藏列表
  loadFavorites(){
    let loginFlag = wx.getStorageSync("loginFlag") || false
    // 未登录，直接清空收藏列表，不读取缓存
    if(!loginFlag){
      this.setData({
        newsList: []
      })
      return;
    }
    let info = wx.getStorageInfoSync()
    let keys = info.keys
    let myList = []
    for(var i = 0; i < keys.length; i++){
      let obj = wx.getStorageSync(keys[i])
      if(obj && obj.id){
        myList.push(obj)
      }
    }

    this.setData({
      newsList: myList,
    })
  },

  onShow: function(){
    if(this.data.isLogin){
      this.loadFavorites()
    }
  },

  goToDetail: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
  }
})