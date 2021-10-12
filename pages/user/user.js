Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    //被收藏的商品的数量
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1.获取缓存中的user信息
    const {userInfo} = wx.getStorageSync('userInfo')
    //获取收藏数组
    const collect = wx.getStorageSync('collect')
    this.setData({
      userInfo,
      collectNum: collect.length
    })
  },

})