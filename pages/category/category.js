// pages/category/category.js
import {request} from "../../request/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧菜单数据
    rightContent: [],
    //左侧被选中的选型
    currentIndex: 0,
    //右侧内容滚动条距离顶部的距离
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCategory()
    /*
    * 小程序和web的存取数据方法的区别
    *   1.使用的代码不同
    *        web：存：localStorage.setItem('key', 'value')
    *             取：localStorage.getItem('key')
    *   微信小程序：存：wx.setStorageSync('key','value')
    *                举例:wx.setStorageSync('cates', {time: Date.now(), data: this.Cates})
    *             取：wx.getStorageSync('key')
    *                举例：wx.getStorageSync('cates')
    *   2.存的时候，是否自动数据类型转换
    *        web：不管存入什么类型的数据，都会线条用toString方法，再存
    *   微信小程序：不存在数据类型转换，存什么类型的数据，就以什么类型的数据，获取的时候也就是什么类型
    * 数据缓存
    *   1.首次获取数据时，将数据缓存
    *   2.判断本地存储中是否有旧数据
    *     {time.Date.now(),data: [...]}
    *   2.1.获取存储的数据，没有数据，进入2.2；有，进入2.3
    *   2.2.以是否获取到为判断依据进行判断
    *       没有旧数据时，发送网络请求请求数据
    *       有旧数据，且数据没有过期时，使用旧数据
    *
    * */
    // 2.判断是否有旧数据
    // 2.1获取本地存储数据
    // 此处，需要我们预先存储过数据，才会有，因此，我们每次首次获取数据后都应该保存
    const Cates = wx.getStorageSync('cates')
    //2.2判断，如果没有，就发出新请求
    if (!Cates) {
      //发出新的请求
      this.getCategory()
    } else {
      //有数据，判断是否过期
      if ((Date.now() - Cates.time) > 1000 * 10) {
        this.getCategory()
      } else {
        this.Cates = Cates.data
        //左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        //右侧内容数据(此处为默认显示第一个，后续是通过点击事件来更换数据)
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCategory() {
    // request({
    //   url: '/categories'
    // }).then(res => {
    //   console.log(res)
    // //在request中设置后可以去掉后面的data.message
    //   this.Cates = res.data.message
    //   //1.预先存储数据到本地，把接口数据存入到本地存储
    //   wx.setStorageSync('cates', {time: Date.now(), data: this.Cates})
    //   //左侧大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   //右侧内容数据(此处为默认显示第一个，后续是通过点击事件来更换数据)
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    //
    // })
    try {
      const res = await request({url: '/categories'})
      this.Cates = res
      //1.预先存储数据到本地，把接口数据存入到本地存储
      wx.setStorageSync('cates', {time: Date.now(), data: this.Cates})
      //左侧大菜单数据
      let leftMenuList = this.Cates.map(v => v.cat_name)
      //右侧内容数据(此处为默认显示第一个，后续是通过点击事件来更换数据)
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    } catch (err) {

    }
  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    //1.获取被点击标题索引
    const index = e.currentTarget.dataset.index;
    //2.将值赋给currentIndex
    // this.setData({
    //   currentIndex: index
    // })
    // 进阶：复制currentIndex并切换数据
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置 右侧内容scroll-view标签距离顶部的距离
      scrollTop: 0
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