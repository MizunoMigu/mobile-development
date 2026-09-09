const db = wx.cloud.database();
const photos = db.collection("photos");
const app = getApp();
const PAGE_SIZE = 10;
const { PHOTO_TAGS } = require("../../utils/photoTags");

function formatPhoto(item) {
  const name = item.nickName || "微信用户";
  return {
    ...item,
    nickName: name,
    initial: name.slice(0, 1),
    tag: item.tag || "未分类",
  };
}

Page({
  data: {
    photoList: [],
    photoTags: ["全部"].concat(PHOTO_TAGS),
    activeTag: "全部",
    emptyText: "还没有人分享图片",
    loading: true,
    loadingMore: false,
    hasMore: true,
    errorText: "",
  },

  onShow() {
    this.loadPhotos(true);
  },

  loadPhotos(reset = true) {
    if ((!reset && this.data.loadingMore) || (!reset && !this.data.hasMore)) return;
    if (reset) this.feedRequestId = (this.feedRequestId || 0) + 1;
    const requestId = this.feedRequestId;
    const activeTag = this.data.activeTag;
    const offset = reset ? 0 : this.data.photoList.length;
    this.setData(reset
      ? { photoList: [], loading: true, loadingMore: false, errorText: "", hasMore: true }
      : { loadingMore: true });

    let query = photos;
    if (activeTag !== "全部") query = query.where({ tag: activeTag });
    query.orderBy("createdAt", "desc").skip(offset).limit(PAGE_SIZE).get({
      success: (res) => {
        if (requestId !== this.feedRequestId || activeTag !== this.data.activeTag) return;
        const next = res.data.map(formatPhoto);
        this.setData({
          photoList: reset ? next : this.data.photoList.concat(next),
          hasMore: next.length === PAGE_SIZE,
        });
      },
      fail: () => {
        if (requestId !== this.feedRequestId || activeTag !== this.data.activeTag) return;
        if (reset) {
          this.setData({ photoList: [], errorText: "图片筛选加载失败，请稍后重试" });
        } else {
          wx.showToast({ title: "加载失败", icon: "none" });
        }
      },
      complete: () => {
        if (requestId !== this.feedRequestId || activeTag !== this.data.activeTag) return;
        this.setData({ loading: false, loadingMore: false });
        wx.stopPullDownRefresh();
      },
    });
  },

  selectTag(e) {
    const activeTag = e.currentTarget.dataset.tag;
    if (activeTag === this.data.activeTag) return;
    this.setData({
      activeTag,
      emptyText: activeTag === "全部" ? "还没有人分享图片" : "该标签下还没有图片",
    });
    this.loadPhotos(true);
  },

  goToAdd() {
    wx.switchTab({ url: "/pages/add/add" });
  },

  openAuthor(e) {
    app.globalData.profileOpenid = e.currentTarget.dataset.openid;
    wx.switchTab({ url: "/pages/homepage/homepage" });
  },

  onPullDownRefresh() {
    this.loadPhotos(true);
  },

  onReachBottom() {
    this.loadPhotos(false);
  },

  retryLoad() {
    this.loadPhotos(true);
  },

  onShareAppMessage() {
    return { title: "图片分享社区", path: "/pages/index/index" };
  },
});
