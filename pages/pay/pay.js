import {getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment} from "../../utils/asyncWx";
import {request} from "../../request/request";
/*
* 1.页面加载
*   1.1.从缓存中获取购物车数据，渲染到页面中
*     数据共同点：checked = true
* 2.微信支付的要求（概念）
*   2.1.哪些人和账号可以支付
*     2.1.1.企业账号
*     2.1.2.企业账号的小程序后台中必须给开发者添加白名单
*         一个appid可以同时绑定多个开发者
*         这些开发者就可以使用这个appid和它的开发权限
*   支付流程：
*     创建订单->准备预支付->发起微信支付->查询订单
*   创建订单：
*     目的：获取一个订单编号
*     1.获取用户登录成功后的token
*     2.根据用户的token来为用户创建订单
* 3.支付按钮（创建订单）
*   3.1.判断缓存中有没有token
*   3.2.没有，跳转到授权页面，获取token
*   3.3.有，使用这个token
*   3.4.创建订单，获取订单号
* 4.预支付
* 5.发起微信支付
* 6.查询后台 订单状态
* 7.支付成功
* 8.手动地删除缓存中被选中的商品
* 9.将删除后的购物车数据，填充回缓存中
* 10.跳转页面
* */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cartList: [],
    totalPrice: 0,
    totalNum: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const address = wx.getStorageSync('address')
    let cartList = wx.getStorageSync('cart') || []
    //1.1.过滤后的购物车数组
    cartList = cartList.filter(v => v.checked)
    let totalPrice = 0
    let totalNum = 0
    cartList.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num
    })
    this.setData({
      address,
      cartList,
      totalPrice,
      totalNum
    })
  },
  //点击支付
  async payClick() {
    try {
      //3.1.判断缓存中有没有token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        })
        return
      }
      //3.4.创建订单
      //3.4.1.准备，请求头参数
      const header = {Authorization: token}
      //3.4.2.准备，请求体参数
      const order_price = this.data.totalPrice
      console.log(this.data.address)
      const consignee_addr = this.data.address.addressMes
      let goods = []
      this.data.cartList.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      }))
      const orderParams = {order_price, consignee_addr, goods}
      //3.4.3.发送请求，创建订单，获取订单编号
      const {order_number} = await request({
        url: '/my/orders/create',
        method: 'post',
        data: orderParams,
        header
      })
      //4.准备发起预支付的接口
      const {pay} = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        header,
        data: {order_number}
      })
      //5.发起微信支付
      await requestPayment(pay)
      //6.查询后台 订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'post',
        header,
        data: {order_number}
      })
      await showToast({
        title: '支付成功'
      })
      //8.手动删除缓存中已经支付了的数据
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      //7.支付成功了，10跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order'
      })
    } catch (e) {
      await showToast({
        title: '支付失败'
      })
      console.log(e)
    }
  }
})