// pages/index/index.js
var common = require('../../utils/common.js') //引用公共JS文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //幻灯片素材
    swiperImg: [
      {src: 'https://news.ouc.edu.cn/_upload/article/images/83/47/75d4ca9c44458941226f24393cd8/ccfd7413-d262-4f43-8b62-c6eaee2ffe5b.jpg'},
      {src: 'https://news.ouc.edu.cn/_upload/article/images/e8/57/7cae799545599c76f8e15a5427af/2dd5293f-4ade-4978-a9dc-e5e17d94a054.jpg'},
      {src: 'https://news.ouc.edu.cn/_upload/article/images/bb/cf/f529d7134218a15c5aec0b2098b2/d6ed02be-25d1-416a-9940-f168e17e2b06.jpg'},
      {src: 'https://news.ouc.edu.cn/_upload/article/images/74/d6/b14f185544daadfce33d3cee6d26/911fbee7-1cae-4d91-a975-0e6294859d29.jpg'}
    ],
  },

  /**
   * 自定义函数--跳转新页面浏览新闻内容
   */
  goToDetail: function(e) {
    //获取携带的data-id数据
    let id = e.currentTarget.dataset.id;
    //携带新闻id进行页面跳转
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取新闻列表
    let list = common.getNewsList()
    //更新列表数据
    this.setData({
      newsList: list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})