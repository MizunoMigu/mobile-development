const db = wx.cloud.database();
const photos = db.collection("photos");
const PAGE_SIZE = 10;
const app = getApp();

function formatPhoto(item) {
  const name = item.nickName || "微信用户";
  return {
    ...item,
    nickName: name,
    initial: name.slice(0, 1),
    tag: item.tag || "未分类",
  };
}

function formatUser(userInfo) {
  if (!userInfo) return null;
  const name = userInfo.nickName || "微信用户";
  return {
    avatarUrl: userInfo.avatarUrl || "",
    nickName: name,
    initial: name.slice(0, 1),
  };
}

Page({
  data: {
    openid: "",
    author: null,
    photoList: [],
    loading: true,
    loadingMore: false,
    hasMore: true,
    identityLoading: false,
    editingProfile: false,
    profileSaving: false,
    draftAvatarUrl: "",
    draftNickName: "",
    draftInitial: "微",
    isSelf: true,
    loggedIn: false,
    emptyText: "登录后查看你上传的图片",
    errorText: "",
  },

  onLoad(options) {
    if (options.id) app.globalData.profileOpenid = options.id;
  },

  onShow() {
    const selectedOpenid = app.globalData.profileOpenid;
    if (selectedOpenid) {
      app.globalData.profileOpenid = "";
      this.showProfile(selectedOpenid, selectedOpenid === app.globalData.openid);
      return;
    }

    if (app.globalData.openid && app.globalData.userInfo) {
      this.showProfile(app.globalData.openid, true);
      return;
    }

    this.setData({
      openid: "",
      author: null,
      photoList: [],
      loading: false,
      isSelf: true,
      loggedIn: false,
      editingProfile: false,
      profileSaving: false,
      emptyText: "登录后查看你上传的图片",
      errorText: "",
    });
  },

  showProfile(openid, isSelf) {
    const userInfo = isSelf ? formatUser(app.globalData.userInfo) : null;
    const loggedIn = Boolean(isSelf && userInfo);
    this.setData({
      openid,
      isSelf,
      loggedIn,
      author: userInfo,
      editingProfile: false,
      emptyText: isSelf ? "你还没有分享图片" : "该用户还没有分享图片",
    });
    if (isSelf && !loggedIn) {
      this.setData({
        author: null,
        photoList: [],
        loading: false,
        loadingMore: false,
        hasMore: true,
        errorText: "",
      });
      return;
    }
    this.loadPhotos(true);
  },

  login() {
    if (this.data.identityLoading) return;
    this.setData({ identityLoading: true });
    app.login()
      .then(({ userInfo, openid }) => {
        this.setData({
          loggedIn: true,
          author: formatUser(userInfo),
        });
        this.showProfile(openid, true);
        wx.showToast({ title: "登录成功" });
      })
      .catch(() => wx.showToast({ title: "登录未完成", icon: "none" }))
      .finally(() => this.setData({ identityLoading: false }));
  },

  openProfileEditor() {
    const profile = app.globalData.userInfo || {};
    const nickName = profile.nickName || "微信用户";
    this.setData({
      editingProfile: true,
      draftAvatarUrl: profile.avatarUrl || "",
      draftNickName: nickName,
      draftInitial: nickName.slice(0, 1),
    });
  },

  chooseProfileAvatar(e) {
    this.setData({ draftAvatarUrl: e.detail.avatarUrl });
  },

  onNicknameInput(e) {
    const draftNickName = e.detail.value;
    this.setData({
      draftNickName,
      draftInitial: draftNickName.trim().slice(0, 1) || "微",
    });
  },

  cancelProfileEdit() {
    if (this.data.profileSaving) return;
    this.setData({ editingProfile: false });
  },

  saveProfile(e) {
    if (this.data.profileSaving || !app.globalData.openid) return;
    const formValue = e && e.detail && e.detail.value;
    const submittedName = formValue && formValue.nickName;
    const nickName = String(
      submittedName === undefined ? this.data.draftNickName : submittedName
    ).trim();
    if (!nickName) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }

    const avatarUrl = this.data.draftAvatarUrl;
    const currentAvatar = (app.globalData.userInfo && app.globalData.userInfo.avatarUrl) || "";
    const isPersistentAvatar = /^cloud:\/\//.test(avatarUrl) || /^https:\/\//.test(avatarUrl);
    const needsUpload = avatarUrl
      && avatarUrl !== currentAvatar
      && !isPersistentAvatar;

    this.setData({ profileSaving: true });
    wx.showLoading({ title: "保存中", mask: true });
    if (!needsUpload) {
      this.persistProfile({ avatarUrl, nickName });
      return;
    }

    const suffix = (avatarUrl.match(/\.[^.]+$/) || [".jpg"])[0];
    wx.cloud.uploadFile({
      cloudPath: `avatars/${app.globalData.openid}-${Date.now()}${suffix}`,
      filePath: avatarUrl,
      success: (res) => this.persistProfile({ avatarUrl: res.fileID, nickName }),
      fail: () => {
        wx.hideLoading();
        this.setData({ profileSaving: false });
        wx.showToast({ title: "头像上传失败", icon: "none" });
      },
    });
  },

  persistProfile(profileData) {
    const profile = app.saveUserProfile({
      ...(app.globalData.userInfo || {}),
      ...profileData,
    });
    photos.where({ _openid: app.globalData.openid }).update({
      data: {
        avatarUrl: profile.avatarUrl,
        nickName: profile.nickName,
      },
      success: () => this.finishProfileSave(profile, false),
      fail: () => this.finishProfileSave(profile, true),
    });
  },

  finishProfileSave(profile, syncFailed) {
    wx.hideLoading();
    this.setData({
      author: formatUser(profile),
      photoList: this.data.photoList.map((photo) => ({
        ...photo,
        avatarUrl: profile.avatarUrl,
        nickName: profile.nickName,
        initial: profile.nickName.slice(0, 1),
      })),
      editingProfile: false,
      profileSaving: false,
    });
    wx.showToast({
      title: syncFailed ? "资料已保存，作品信息同步失败" : "资料已更新",
      icon: syncFailed ? "none" : "success",
    });
  },

  logout() {
    wx.showModal({
      title: "退出登录",
      content: "退出后将隐藏个人上传记录，并且不能继续上传图片。",
      confirmText: "退出",
      success: (res) => {
        if (!res.confirm) return;
        app.logout();
        this.setData({
          openid: "",
          author: null,
          photoList: [],
          loading: false,
          loadingMore: false,
          hasMore: true,
          isSelf: true,
          loggedIn: false,
          editingProfile: false,
          profileSaving: false,
          emptyText: "登录后查看你上传的图片",
          errorText: "",
        });
        wx.showToast({ title: "已退出登录" });
      },
    });
  },

  loadPhotos(reset = true) {
    if (!this.data.openid) {
      this.setData({ loading: false, errorText: "用户信息无效" });
      wx.stopPullDownRefresh();
      return;
    }
    if ((!reset && this.data.loadingMore) || (!reset && !this.data.hasMore)) return;

    const offset = reset ? 0 : this.data.photoList.length;
    this.setData(reset
      ? { loading: true, errorText: "", hasMore: true }
      : { loadingMore: true });
    photos.orderBy("createdAt", "desc").where({ _openid: this.data.openid })
      .skip(offset).limit(PAGE_SIZE).get({
      success: (res) => {
        const next = res.data.map(formatPhoto);
        const photoList = reset ? next : this.data.photoList.concat(next);
        this.setData({
          photoList,
          author: this.data.isSelf
            ? formatUser(app.globalData.userInfo)
            : (photoList[0] || null),
          hasMore: next.length === PAGE_SIZE,
        });
      },
      fail: () => {
        if (reset) this.setData({ errorText: "作者作品加载失败" });
        else wx.showToast({ title: "加载失败", icon: "none" });
      },
      complete: () => {
        this.setData({ loading: false, loadingMore: false });
        wx.stopPullDownRefresh();
      },
    });
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
    const author = this.data.author;
    return {
      title: author ? `${author.nickName}的图片主页` : "图片分享社区",
      path: this.data.openid
        ? `/pages/homepage/homepage?id=${this.data.openid}`
        : "/pages/homepage/homepage",
    };
  },
});
