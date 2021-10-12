// pages/goods_list/goods_list.js
/*
* 1.上拉加载
*   1.找到滚动条触底事件
*   2.判断是否还有下一页数据
*     2.1.获取总页数：可以通过返回的数据条数和每一页的数据量来计算
*     2.2.获取当前页数：pagenum
*     2.3.进行比较，当前页数小于总页数，则还有数据
*   3.假如有下页数据，加载数据
*     3.1.将当前页码+1
*     3.2.重新发送请求，并将新数据加到旧数据的后面。即拼接，而不是直接赋值覆盖
*   4.假如没有下页数据，弹出提示
*
* 2.下拉刷新
*   1.触发下拉刷新事件，需要
*     1.1.在json文件中开启配置项
*     1.2.在js文件的下拉刷新事件中写业务代码
*   2.重置数据，数组
*   3.重置页面数
*   4.发送新请求
*   5.发送新请求后关闭此次刷新
* */
import {request} from "../../request/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  //保存总页数
  totalnums: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },
  //获取商品列表数据
  async getGoodsList() {
    try {
      const res = await request({
        url: '/goods/search',
        data: this.QueryParams
      })
      //2.1.获取总页数
      const total = res.total
      this.totalnums = Math.ceil(total / this.QueryParams.pagesize)
      // this.data.goodsList.push(...res.goods)
      this.setData({
        // goodsList: this.data.goodsList,
        goodsList: [...this.data.goodsList, ...res.goods]
      })

    } catch (e) {

    }
  },

  //标题点击事件，修改isActive
  tabsClick(e) {
    console.log(e.detail)
    const index = e.detail
    const tabs = this.data.tabs
    tabs.forEach((value, index1) => {
      index1 === index ? value.isActive = true : value.isActive = false
    })
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  // 刷新1
  onPullDownRefresh: function () {
    //刷新2：重置数组
    this.setData({
      goodsList: []
    })
    //刷新3：重置
    this.QueryParams.pagenum = 1
    //刷新4：发送请求
    this.getGoodsList()
    //刷新5：请求完数据后停止此次刷新
    wx.stopPullDownRefresh()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  //1.页面触底事件
  onReachBottom: function () {
    console.log('页面触底了')
    //2.判断
    //2.3.比较总页数与当前页数
    if (this.QueryParams.pagenum < this.totalnums) {
      //3.还有数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    } else {
      //4.没有数据了
      wx.showToast({
        title: '我不是赛罗，我是有底线的！',
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})