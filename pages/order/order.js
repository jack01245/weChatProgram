/*
* 1.页面被打开的时候 onShow
*   1.1(0.5)判断缓存中有没有token
*     有，往下进行
*     没有，跳转到授权界面
*   1.1.获取url上的参数 type
*     onShow不同于onLoad，无法在形参上接受 options参数
*     我们需要通过以下方法来获取
*     1.1.1.获取当前小程序的页面栈，数组，最大程度是10页面
*       getCurrentPages()
*       数组中的每一个元素是一整个页面，也就是说，页面中的所有东西都可以找到
*     1.1.2.数组中索引最大的页面就是当前页面
*   1.2.根据type  发送请求获取订单数据
*     1.2.1.获取type,决定页面哪个标题被选中
*     1.2.2.根据type来发送请求
*     我们发现此时，返回结果为null，这是因为我们的token没有被传过去
*     所以我们需要在刚开始的时候判断token，添加步骤1.1(0.5)
*   1.3.渲染页面
* 2.点击不同的标题，重新发送请求来获取数据，渲染页面
* */
import {request} from "../../request/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //tab的数据
    tabs: [
      {
        id: 0,
        value: '全部订单',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待收货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      },
    ],
    //请求到的清单数据
    orders: []
  },
  //修改被点击的标题
  changeTabsIndex(index) {
    const tabs = this.data.tabs
    tabs.forEach((value, index1) => {
      index1 === index ? value.isActive = true : value.isActive = false
    })
    this.setData({
      tabs
    })
  },
  //tabs逻辑
  tabsClick(e) {
    const index = e.detail
    this.changeTabsIndex(index)
    //2.点击不同标题时，发送请求
    this.getOrders(index + 1)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1.1()0.5判断token
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }
    //1.1.1.获取当前小程序的页面栈，
    let pages = getCurrentPages()
    //1.1.2.获取当前页面，也就是，索引最大的页面
    let currentPage = pages[pages.length - 1]
    //1.2.根据type  发送请求获取订单数据
    //1.2.1.获取type
    const {type} = currentPage.options
    //1.2.1.获取type,决定页面哪个标题被选中
    this.changeTabsIndex(type - 1)
    //1.2.2.根据type来发送请求
    this.getOrders(type)
  },
  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: '/my/orders/all',
      data: type
    })
    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleDateString()
      }))
    })
  }
})