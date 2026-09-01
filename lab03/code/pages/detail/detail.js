var common = require("../../utils/common.js")

Page({
  // goToDetail: function(e){
  //   let id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: "../detail/detail?id = " + id
  //   })
  // },

  onLoad: function(options){
    let id = options.id
    let isLogin = wx.getStorageSync('loginFlag') || false
    var article = wx.getStorageSync(id)
    if(article != ''  && isLogin){
      this.setData({
        article: article,
        isAdd: true,
        isLogin: isLogin
      })
    }
    else{
      let result = common.getNewsDetail(id)
      if(result.code == '200'){
        this.setData({
          article: result.news, 
          isAdd: false,
          isLogin: isLogin
        })
      }
    }
    // let result = common.getNewsDetail(id)
    // if(result.code == '200'){
    //   this.setData({article:result.news})
    // }
    
  },

  addFavorites: function(options){
    if(!this.data.isLogin){
      wx.showToast({
        title:"请先登录!",
        icon:"none"
      })
      return;
    }
    let article = this.data.article;
    wx.setStorageSync(article.id, article);
    this.setData({isAdd: true});
    wx.showToast({title:"收藏成功"})
  },

  cancelFavorites: function(){
    if(!this.data.isLogin){
      wx.showToast({
        title:"请先登录!",
        icon:"none"
      })
      return;
    }
    let article = this.data.article;
    wx.removeStorageSync(article.id);
    this.setData({isAdd: false});
    wx.showToast({title:"取消收藏"})
  },
})