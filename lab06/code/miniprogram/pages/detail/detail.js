const db = wx.cloud.database();
const photos = db.collection("photos");
const app = getApp();

Page({
  data: {
    photo: null,
    loading: true,
    downloading: false,
    sharing: false,
    deleting: false,
    canDelete: false,
    errorText: "",
  },

  onLoad(options) {
    if (!options.id) {
      this.setData({ loading: false, errorText: "图片参数无效" });
      return;
    }

    photos.doc(options.id).get({
      success: (res) => {
        const photo = res.data;
        const canDelete = Boolean(
          app.globalData.userInfo
          && app.globalData.openid
          && photo._openid === app.globalData.openid
        );
        this.setData({ photo, canDelete });
      },
      fail: () => this.setData({ errorText: "图片加载失败" }),
      complete: () => this.setData({ loading: false }),
    });
  },

  downloadPhoto() {
    if (!this.data.photo || this.data.downloading) return;
    this.setData({ downloading: true });
    wx.showLoading({ title: "下载中", mask: true });
    wx.cloud.downloadFile({
      fileID: this.data.photo.photoUrl,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: "保存成功" }),
          fail: () => wx.showToast({ title: "保存失败", icon: "none" }),
          complete: () => this.finishDownload(),
        });
      },
      fail: () => {
        wx.showToast({ title: "下载失败", icon: "none" });
        this.finishDownload();
      },
    });
  },

  finishDownload() {
    wx.hideLoading();
    this.setData({ downloading: false });
  },

  sharePhoto() {
    if (!this.data.photo || this.data.sharing) return;
    if (!wx.showShareImageMenu) {
      wx.showToast({ title: "当前微信版本不支持图片分享", icon: "none" });
      return;
    }

    this.setData({ sharing: true });
    wx.showLoading({ title: "准备分享", mask: true });
    wx.cloud.downloadFile({
      fileID: this.data.photo.photoUrl,
      success: (res) => {
        wx.hideLoading();
        wx.showShareImageMenu({
          path: res.tempFilePath,
          needShowEntrance: false,
          fail: (error) => {
            const message = (error && error.errMsg) || "";
            if (!/cancel/i.test(message)) {
              wx.showToast({ title: "图片分享失败", icon: "none" });
            }
          },
          complete: () => this.setData({ sharing: false }),
        });
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ sharing: false });
        wx.showToast({ title: "图片准备失败", icon: "none" });
      },
    });
  },

  deletePhoto() {
    const photo = this.data.photo;
    const isOwner = Boolean(
      photo
      && app.globalData.userInfo
      && app.globalData.openid
      && photo._openid === app.globalData.openid
    );
    if (!isOwner) {
      this.setData({ canDelete: false });
      wx.showToast({ title: "只能删除自己上传的图片", icon: "none" });
      return;
    }
    if (this.data.deleting) return;

    wx.showModal({
      title: "删除图片",
      content: "删除后无法恢复，确定继续吗？",
      confirmText: "删除",
      confirmColor: "#e65d72",
      success: (res) => {
        if (res.confirm) this.removePhoto(photo);
      },
    });
  },

  removePhoto(photo) {
    this.setData({ deleting: true });
    wx.showLoading({ title: "删除中", mask: true });
    photos.doc(photo._id).remove({
      success: () => {
        wx.cloud.deleteFile({
          fileList: [photo.photoUrl],
          success: () => this.finishDelete("删除成功"),
          fail: () => this.finishDelete("记录已删除，云文件清理失败", true),
        });
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ deleting: false });
        wx.showToast({ title: "删除失败", icon: "none" });
      },
    });
  },

  finishDelete(message, partial = false) {
    wx.hideLoading();
    this.setData({ deleting: false, canDelete: false });
    wx.showToast({ title: message, icon: partial ? "none" : "success" });
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
        fail: () => wx.switchTab({ url: "/pages/homepage/homepage" }),
      });
    }, 800);
  },

  previewPhoto() {
    if (!this.data.photo) return;
    wx.previewImage({
      current: this.data.photo.photoUrl,
      urls: [this.data.photo.photoUrl],
    });
  },
});
