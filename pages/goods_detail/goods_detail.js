/*
* 1.获取商品详情数据
* 2.点击轮播图，预览大图
*   2.1.给轮播图绑定点击事件
*   2.2.调用小程序的api：  previewImage
*     2.2.1.构造预览的图片数组
*     2.2.2.使用api
* 3.点击加入购物车
*   3.1.先绑定点击事件
*   3.2.获取缓存中的购物车数据，数组格式
*   3.3.判断，当前商品是否存在于购物车车
*     3.3.1.存在，修改数据，数量加一，并将数据返回
*     3.3.2.不存在。添加新商品，添加数量，将数据填充回缓存
*   3.4.将修改后的数据添加回缓存
*   3.5.弹出提示，添加成功或失败
* 4.商品收藏
*   4.1.页面onShow(请求数据)的时候，加载缓存中的商品收藏的数据
*     4.1.1.获取缓存中的收藏数组
*   4.2.判断商品是否被收藏
*     4.2.1.是，改变页面图标
*     4.2.2.否，正常展示
*   4.3.点击商品收藏按钮
*     4.3.0.获取缓存中的商品收藏数组
*     4.3.1.判断该商品是否收藏
*     4.3.2.存在，删除，并修改data中的isCollect
*     4.3.3.不存在，添加，并修改data中的isCollect
*   4.4.将修改后的收藏数组添加到缓存中
* */
import {request} from "../../request/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: true
  },
  goodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const goods_id = options.goods_id
    this.getGoodsDetail(goods_id)
  },

  //1.获取商品详情数据
  async getGoodsDetail(goods_id) {
    try {
      const res = await request({
        url: '/goods/detail',
        data: {
          goods_id
        }
      })
      this.goodsInfo = res
      //4.1.1.获取缓存中的收藏数组
      let collect = wx.getStorageSync('collect') || []
      //4.2.判断该商品是否被收藏
      let isCollect = collect.some(v => v.goods_id == goods_id)
      this.setData({
        goodsObj: {
          goods_name: res.goods_name,
          goods_price: res.goods_price,
          //iphone手机，不知别webp图片格式
          //最好是找后台去修改
          //临时可以自己改，确保后台存在： 1.webp => 1.jpg
          // goods_introduce: res.goods_introduce,
          goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics: res.pics,
        },
        isCollect
      })
    } catch (e) {

    } finally {

    }
  },
  //2.点击轮播图 放大预览
  //2.1.触发的点击事件
  swiperClick(e) {
    //2.2.调用api
    //2.2.1.构造要预览的图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    //2.2.2.使用api
    wx.previewImage({
      //该参数是，点击后，预览从那张图片开始，一般而言，我们希望是从点击的那张开始
      //我们可以将被点击图片的url传进来，并给current赋值
      current,
      urls
    })
  },
  //3.1.加入购物车点击事件
  addToCart() {
    //3.2.获取缓存中的购物车数据，数组格式
    //因为第一次获取时，没有数据，是一个空字符串，所以需要通过逻辑运算符将其换成字符串
    let cart = wx.getStorageSync('cart') || []
    //3.3.判断其是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    //3.5.1.创建一个数据，用来保存添加商品数量和添加新商品的不同提示文字
    let title = '添加购物车成功'
    if (index === -1) {
      // 3.3.2.不存在,第一次添加
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    } else {
      // 3.3.1.存在
      cart[index].num++
      title = '商品数量加一'
    }
    // 3.4.将购物车数据重新添加到缓存中
    wx.setStorageSync('cart', cart)
    // 3.5.弹窗提示
    wx.showToast({
      title,
      icon: 'success',
      //true防止用户手抖，疯狂点击，1.5s后才能再次点击
      mask: true
    })
  },
  //4.3.收藏点击事件
  collectClick() {
    let isCollect = false
    //4.3.0.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    //4.3.1.判断该商品是否收藏
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    //index === -1 说明没有，否则说明有
    if (index !== -1) {
      //4.3.2.存在，删除，并修改data中的isCollect
      collect.splice(index, 1)
      isCollect = false
      //弹出提示信息
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      //4.3.3.不存在，添加
      collect.push(this.goodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    //4.4.添加到缓存
    wx.setStorageSync('collect', collect)
    //4.5.修改data中的属性，isCollect
    this.setData({
      isCollect
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})