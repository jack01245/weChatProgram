// pages/feedback/feedback.js
/*
* 1.点击按钮触发tap点击事件
*   1.1.调用小程序内置的 选择图片的api
*   1.2.获取到 图片的路径 数组
*   1.3.把图片路径存入data变量中，
*   1.4.页面根据该数组循环显示图片
* 2.点击自定义组件
*   2.1.获取被点击元素的索引
*   2.2.获取data中的图片数组
*   2.3.根据索引，数组中删除对应元素
*   2.4.把数组重新设置回data中
* 3.点击'提交按钮'
*   3.1.获取文本域的内容
*     3.1.1.data中定义变量，表示输入框内容
*     3.1.2.文本域绑定输入事件，事件触发的时候，把输入框中的值，存入到变量中，将变量提交
*   3.2.最这些内容进行合法性验证
*   3.3.验证通过，用户选择的图片 上传到专门的图片的服务器 返回图片外网连接
*     3.3.1.遍历图片数组
*     3.3.2.挨个上传
*     3.3.3.自己维护图片数组，存放，图片上传后的外网链接
*   3.4.文本域和外网图片的路径一起提交到服务器（前端模拟）
*   3.5.清空当前页面
*   3.6.返回上一页面
* */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    //保存图片url
    imgUrl: [],
    //文本域的内容
    textValue: ''
  },
  //外网图片路径数组
  upLoadImgs: [],
  chooseImgClick() {
    wx.chooseImage({
      success: (res) => {
        this.setData({
          imgUrl: [...this.data.imgUrl, ...res.tempFilePaths]
        })
      }
    })
  },
  tabsClick(e) {
    const index = e.detail
    const tabs = this.data.tabs
    tabs.forEach((value, index1) => {
      index1 === index ? value.isActive = true : value.isActive = false
    })
    this.setData({
      tabs
    })
  },
  deleteClick(e) {
    const {index} = e.currentTarget.dataset
    let {imgUrl} = this.data
    imgUrl.splice(index, 1)
    this.setData({
      imgUrl
    })
  },
  textInput(e) {
    this.setData({
      textValue: e.detail.value
    })
  },

  subClick() {
    const {textValue, imgUrl} = this.data
    if (!textValue.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: "none",
        mask: true
      })
    }
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    //上传文件api不支持多张图片上传
    //多个。遍历数组，挨个上传
    if (imgUrl.length != 0) {
      imgUrl.forEach((v, i) => {
        console.log('+++++++')
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: 'image',
          formData: {},
          success: (res) => {
            let url = JSON.parse(res.data)
            this.upLoadImgs.push(url)
            if (i === imgUrl.length - 1) {
              wx.hideLoading()
              this.setData({
                textValue: '',
                imgUrl: []
              })
              wx.navigateBack({
                delta: 1
              })
            }
          },
          fail: err => {
            console.log(err)
          }
        })
      })
    } else {
      wx.hideLoading()
      console.log('只是提交了文本')
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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