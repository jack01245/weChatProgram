/*
* 1.输入框绑定值改变事件 input事件
*   1.1.获取到输入框的值
*   1.2.合法性判断
*   1.3.检验通过，把输入框的值，发送到后台
*   1.4.返回的数据打印到页面上
* */
import {request} from "../../request/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    //取消按钮的显示
    isFocus: false,
    //input中的值
    inpValue: ''
  },
  timeId: -1,
  //1.输入框值改变事件
  searchInput(e) {
    //1.1.获取输入框的值
    const {value} = e.detail
    //1.2.检验合法性
    // .trim()去掉两边的空格
    if (!value.trim()) {
      //值不合法
      clearTimeout(this.timeId)
      this.setData({
        goods: [],
        isFocus: false
      })
    } else {
      //值合法
      //清除上一个定时器
      this.setData({
        isFocus: true
      })
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => {
        this.qsearch(value)
      }, 1000)
    }
  },
  //发送请求函数，获取搜索建议数据
  async qsearch(query) {
    try {
      const res = await request({
        url: '/goods/qsearch',
        data: {query}
      })
      this.setData({
        goods: res
      })
    } catch (e) {

    }
  },
  //取消按钮的点击
  clearClick() {
    this.setData({
      inpValue: '',
      isFocus: false,
      goods: []
    })
  }
})