// pages/auth/auth.js
import {login} from "../../utils/asyncWx";
import {request} from "../../request/request";

Page({
  //获取用户信息
  async getUserMes(e) {
    try {
      //1.获取用户信息
      const {encryptedData, rawData, iv, signature} = e.detail
      //2.调用 login  API来获取code
      const {code} = await login()
      const loginParams = {
        encryptedData, rawData, iv, signature, code
      }
      //3.获取token
      // const {token} = await request({
      //   url: '/users/wxlogin',
      //   data: loginParams,
      //   method: 'post'
      // })
      //4.把token存入缓存中，在跳转回上一个页面
      wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
      wx.navigateBack({
        delta: 1
      })
    } catch (e) {
      console.log(e)
    }
  }
})