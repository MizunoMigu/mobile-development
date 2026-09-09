const db = wx.cloud.database();
const photos = db.collection("photos");
const app = getApp();
const PAGE_SIZE = 30;
const { PHOTO_TAGS } = require("../../utils/photoTags");

function formatDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

Page({
  data: {
    userId: "",
    loggedIn: false,
    photoTags: PHOTO_TAGS,
    selectedTag: "日常",
    historyPhotos: [],
    loading: true,
    loadingMore: false,
    hasMore: true,
    uploading: false,
    emptyText: "登录后查看你的上传记录",
    errorText: "",
  },

  onShow() {
    if (!app.globalData.userInfo) {
      this.setData({
        userId: "",
        loggedIn: false,
        historyPhotos: [],
        loading: false,
        loadingMore: false,
        hasMore: true,
        emptyText: "登录后查看你的上传记录",
        errorText: "",
      });
      return;
    }

    this.setData({
      userId: "",
      loggedIn: true,
      historyPhotos: [],
      loading: true,
      emptyText: "暂无上传记录",
      errorText: "",
    });
    app.getOpenId()
      .then((userId) => {
        if (!app.globalData.userInfo) return;
        this.setData({ userId });
        this.getHistoryPhotos(true);
      })
      .catch(() => this.setData({
        userId: "",
        historyPhotos: [],
        loading: false,
        errorText: "用户身份获取失败",
      }));
  },

  upload() {
    if (this.data.uploading) return;
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: "请先登录",
        content: "登录微信账号后才能上传图片和查看上传记录。",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) wx.switchTab({ url: "/pages/homepage/homepage" });
        },
      });
      return;
    }

    app.getOpenId()
      .then((userId) => {
        this.setData({ userId, loggedIn: true });
        this.choosePhoto();
      })
      .catch(() => wx.showToast({ title: "用户身份获取失败", icon: "none" }));
  },

  selectTag(e) {
    this.setData({ selectedTag: e.currentTarget.dataset.tag });
  },

  choosePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => this.uploadPhoto(res.tempFilePaths[0]),
    });
  },

  uploadPhoto(filePath) {
    const suffix = (filePath.match(/\.[^.]+$/) || [".jpg"])[0];
    const cloudPath = `photos/${Date.now()}-${Math.floor(Math.random() * 1000000)}${suffix}`;
    this.setData({ uploading: true });
    wx.showLoading({ title: "上传中", mask: true });

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => this.savePhoto(res.fileID),
      fail: () => {
        this.finishUpload();
        wx.showToast({ title: "上传失败", icon: "none" });
      },
    });
  },

  savePhoto(fileID) {
    const userInfo = app.globalData.userInfo || {};
    photos.add({
      data: {
        photoUrl: fileID,
        avatarUrl: userInfo.avatarUrl || "",
        nickName: userInfo.nickName || "微信用户",
        tag: this.data.selectedTag,
        addDate: formatDate(),
        createdAt: db.serverDate(),
      },
      success: () => {
        wx.showToast({ title: "上传成功" });
        this.getHistoryPhotos(true);
      },
      fail: () => wx.showToast({ title: "记录保存失败", icon: "none" }),
      complete: () => this.finishUpload(),
    });
  },

  finishUpload() {
    wx.hideLoading();
    this.setData({ uploading: false });
  },

  getHistoryPhotos(reset = true) {
    if (!this.data.loggedIn || !this.data.userId) {
      this.setData({ historyPhotos: [], loading: false, loadingMore: false });
      return;
    }
    if ((!reset && this.data.loadingMore) || (!reset && !this.data.hasMore)) return;
    const offset = reset ? 0 : this.data.historyPhotos.length;
    this.setData(reset
      ? { loading: true, errorText: "", hasMore: true }
      : { loadingMore: true });
    const userId = this.data.userId;
    photos.orderBy("createdAt", "desc").where({ _openid: userId })
      .skip(offset).limit(PAGE_SIZE).get()
      .then((res) => this.setData({
        historyPhotos: reset ? res.data : this.data.historyPhotos.concat(res.data),
        hasMore: res.data.length === PAGE_SIZE,
      }))
      .catch(() => {
        if (reset) this.setData({ historyPhotos: [], errorText: "历史记录加载失败" });
        else wx.showToast({ title: "加载失败", icon: "none" });
      })
      .finally(() => this.setData({ loading: false, loadingMore: false }));
  },

  previewHistory(e) {
    const current = e.currentTarget.dataset.url;
    const urls = this.data.historyPhotos.map((item) => item.photoUrl);
    wx.previewImage({ current, urls });
  },

  onReachBottom() {
    this.getHistoryPhotos(false);
  },

  retryLoad() {
    if (!this.data.userId) {
      this.onShow();
      return;
    }
    this.getHistoryPhotos(true);
  },
});
