App({
  globalData: {
    env: "",
    userInfo: null,
    openid: null,
    profileOpenid: "",
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上基础库");
      return;
    }

    const options = { traceUser: true };
    if (this.globalData.env) options.env = this.globalData.env;
    wx.cloud.init(options);
  },

  getOpenId() {
    if (this.globalData.openid) {
      return Promise.resolve(this.globalData.openid);
    }

    return wx.cloud.callFunction({ name: "getOpenid" }).then((res) => {
      const openid = res.result && res.result.openid;
      if (!openid) throw new Error("未获取到 openid");
      this.globalData.openid = openid;
      return openid;
    });
  },

  normalizeUserInfo(userInfo = {}) {
    const nickName = String(userInfo.nickName || "").trim() || "微信用户";
    return {
      avatarUrl: userInfo.avatarUrl || "",
      nickName,
    };
  },

  saveUserProfile(userInfo) {
    const profile = this.normalizeUserInfo(userInfo);
    this.globalData.userInfo = profile;
    if (this.globalData.openid) {
      try {
        wx.setStorageSync(`cloudPhotoProfile:${this.globalData.openid}`, profile);
      } catch (error) {
        console.warn("用户资料缓存失败", error);
      }
    }
    return profile;
  },

  loadUserProfile(openid) {
    try {
      const cached = wx.getStorageSync(`cloudPhotoProfile:${openid}`);
      if (cached && typeof cached === "object") {
        return Promise.resolve(this.saveUserProfile(cached));
      }
    } catch (error) {
      console.warn("用户资料缓存读取失败", error);
    }

    return wx.cloud.database().collection("photos")
      .where({ _openid: openid })
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((res) => {
        const latestPhoto = res.data[0] || {};
        return this.saveUserProfile({
          avatarUrl: latestPhoto.avatarUrl || "",
          nickName: latestPhoto.nickName || "微信用户",
        });
      })
      .catch(() => this.saveUserProfile({}));
  },

  login() {
    return this.getOpenId()
      .then((openid) => this.loadUserProfile(openid)
        .then((userInfo) => ({ userInfo, openid })));
  },

  logout() {
    this.globalData.userInfo = null;
    this.globalData.openid = null;
    this.globalData.profileOpenid = "";
  },
});
