// pages/login/login.js
import {getUserProfile} from "../../utils/asyncWx";

Page({
  // getUserInfo(e) {
  //   const {userInfo} = e.detail
  //   wx.setStorageSync('userInfo', userInfo)
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },

  async getUserProfile() {
    let userInfo = await getUserProfile('完善用户资料')
    wx.setStorageSync('userInfo', userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})