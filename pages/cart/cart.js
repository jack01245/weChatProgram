/*
* 1.获取用户的收货地址
*   1.1方案一：
*   1.1.1.绑定点击事件
*   1.1.2.调用小程序内置 api 获取用户收货地址  wx.chooseAddress
*   注意:因为,用户的地址是需要用户给予权限,才可以获取,因此,我们需要先知道
*       用户是否给与了权限,进入方案二
*   1.2.方案二：
*   1.2.1获取用户对先程序授予的获取地址的权限 状态 scope
*   1.2.2对权限进行判断
*     1.2.1.1.假设用户 点击获取收货地址的提示框中的确定  authSetting scope.address
*         scope值 true 直接调用获取收获地址
*     1.2.1.2.假设用户 从来没有调用过收货地址 收货地址的api
*         scope值 undefined 直接调用获取收获地址
*     1.2.1.3.假设用户 点击获取收获地址的提示框中的取消
*         scope值 false
*        1.2.1.3.1.诱导用户自己打开授权设置页面,当用户重新给予,获取地址权限的时候
*        1.2.1.3.2.获取收货地址
* 2.将获取到的收货地址存入到本地存储中缓存
*   优化：
*     2.1.获取本地存储中的数据
*     2.2.把数据设置给data中的一个变量
*   注意：
*     因为这是一个市场需要更新的数据，因此，我们在onShow中实现
* 3.onShow
*   3.0.在商品详情页面添加购物车代码中，第一次添加商品时，添加属性。
*       1.num：商品购买数量（初始为1）
*       2.checked：商品选中状态（默认true）
*   3.1.获取缓存中的购物车数组
*   3.2.将数据填充到页面中
* 4.全选的实现
*   4.1.onShow中获取缓存中的购物车数据
*   4.2.根据购物车商品数据进行计算
* 5.总价格和总数量
*   5.1.计算被选中的商品
*   5.2.获取购物车数组
*   5.3.遍历
*   5.4.判断是否选中，选中
*   5.5.总价格 +=商品单价*商品数量
*   5.6.将计算后的数据返回到data中
* 6.商品选中功能
*   6.1.绑定change事件
*   6.2.获取被修改的商品对象
*     6.2.1.获取要修改的商品数据id
*     6.2.2.获取商品数组
*     6.2.3.找到被修改的商品对象
*   6.3.商品对象的选中状态取反
*   6.4.重新填充回data中的和缓存中
*   6.5.重新计算相关属性
* 7.商品数量的修改
*   7.1.创建对应的点击事件
*       两者传递一个事件，通过属性来判断加减
*   7.2.传递商品goods_id
*   7.3.获取data中购物车数组和修改的商品对象
*   7.4.修改商品对象数量
*     7.4.1.商品数量>1  正常
*     7.4.2.商品数量=1  点击减少时，弹出提示，询问是否删除，确认，直接删除，取消，什么都不做
*   7.5.放回缓存和data
* 8.全选，反选实现
*   8.1.全选的复选框绑定事件
*   8.2.获取data中的allChecked的状态
*   8.3.判断状态，未全选，则只是未选中取反修改
*       已全选，就把所有商品都未选中
*   8.4.将数据重新设置回data和缓存中
* 9.结算按钮点击
*   9.1.判断有没有收获信息
*   9.2.判断有没有选购商品
*   9.3.跳转到支付页面
* */

import {getSetting, chooseAddress, openSetting, showModal, showToast} from "../../utils/asyncWx";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cartList: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  //1.获取用户收获地址

  //1.1.1收货地址点击事件
  // chooseAddress() {
  //   //1.1.2.调用api，获取收获地址
  //   // wx.chooseAddress({
  //   //   success: (res) => {
  //   //     console.log(res)
  //   //   }
  //   // })
  //
  //   //1.2.1获取用户收货地址权限
  //   wx.getSetting({
  //     success: (result) => {
  //       console.log(result)
  //       //保存
  //       const scopeAddress = result.authSetting['scope.address']
  //       //对用户的权限给予进行判断
  //       if (scopeAddress === true || scopeAddress === undefined) {
  //         //1.2.1.1和1.2.1.2
  //         wx.chooseAddress({
  //           success: result1 => {
  //             console.log(result1)
  //           }
  //         })
  //       } else {
  //         //1.2.1.3.用户曾经或以前拒绝过授予权限,诱导用户
  //         wx.openSetting({
  //           success: result2 => {
  //             //用户授予权限后,收货地址
  //             wx.chooseAddress({
  //               success: result3 => {
  //                 console.log(result3)
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  //通过封装以及async来重构
  async chooseAddress() {
    try {
      //1.2.1.获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      //判断权限状态

      // if (scopeAddress === true || scopeAddress === undefined) {
      //   //1.2.1.1    1.2.1.2调用获取收货地址的代码api
      //   // const res2 = await chooseAddress()
      // } else {
      //   //1.2.1.3 用户曾经或以前拒绝过授予权限,诱导用户
      //   //1.2.1.3.1
      //   await openSetting()
      //   //1.2.1.3.2
      //   // const res4 = await chooseAddress()
      //   // console.log(res4)
      // }

      //我们可以对if进行重构
      if (scopeAddress === false) {
        await openSetting()
      }
      //无论如何，我们都会调用该方法，因此可以将其抽离出来
      const address = await chooseAddress()
      //存入地址数据
      address.addressMes = address.provinceName + address.cityName + address.countyName + address.detailInfo
      //2.将获取到收货地址存入缓存
      // wx.setStorageSync('address', {
      //   data: {
      //     res2
      //   }
      // })
      // 2.也可以这样写
      wx.setStorageSync('address', address)
    } catch (err) {
      // console.log(err)
    }

  },
  // 自己的方法
  // //添加按钮点击事件
  // creClick(e) {
  //   const index = e.currentTarget.dataset.index
  //   this.data.cartList[index].num++
  //   const cartList = this.data.cartList
  //   let totalPrice = 0
  //   let totalNum = 0
  //   if (cartList.length != 0) {
  //     cartList.forEach(v => {
  //       if (v.checked) {
  //         totalPrice += v.goods_price * v.num
  //         totalNum += v.num
  //       }
  //     })
  //   }
  //   this.setData({
  //     cartList,
  //     totalPrice,
  //     totalNum
  //   })
  //   wx.setStorageSync('cart', cartList)
  // },
  // //减少按钮点击事件
  // dreClick(e) {
  //   const index = e.currentTarget.dataset.index
  //   if (this.data.cartList[index].num > 1) {
  //     this.data.cartList[index].num--
  //   } else {
  //     this.data.cartList.splice(index, 1)
  //   }
  //   const cartList = this.data.cartList
  //   let allChecked = true
  //   let totalPrice = 0
  //   let totalNum = 0
  //   if (cartList.length != 0) {
  //     cartList.forEach(v => {
  //       if (v.checked) {
  //         totalPrice += v.goods_price * v.num
  //         totalNum += v.num
  //       }
  //     })
  //   } else {
  //     allChecked = false
  //   }
  //   this.setData({
  //     cartList,
  //     totalPrice,
  //     allChecked,
  //     totalNum
  //   })
  //   wx.setStorageSync('cart', cartList)
  // },
  // //商品选中按钮
  // goodsClick(e) {
  //   //获取index
  //   const index = e.currentTarget.dataset.index
  //   //修改数据
  //   this.data.cartList[index].checked = !this.data.cartList[index].checked
  //   //获取修改后的数据
  //   const cartList = this.data.cartList
  //   //通过修改后的数据，重新计算相关值
  //   let allChecked = true
  //   let totalPrice = 0
  //   let totalNum = 0
  //   if (cartList.length != 0) {
  //     cartList.forEach(v => {
  //       if (v.checked) {
  //         totalPrice += v.goods_price * v.num
  //         totalNum += v.num
  //       } else {
  //         allChecked = false
  //       }
  //     })
  //   }
  //   //将数据存入data
  //   this.setData({
  //     cartList,
  //     allChecked,
  //     totalPrice,
  //     totalNum
  //   })
  //   //数据存入缓存
  //   wx.setStorageSync('cart', cartList)
  //
  // },

  //视频方法
  //6.change事件
  goodsClick1(e) {
    //6.2.获取被修改的商品对象
    //6.2.1获取要修改的商品数据id
    const goods_id = e.currentTarget.dataset.id
    //6.2.2.获取商品数组
    let cartList = this.data.cartList
    //6.2.3.找到被修改的商品对象
    let index = cartList.findIndex(v => v.goods_id === goods_id)
    //6.3.根据索引状态取反
    cartList[index].checked = !cartList[index].checked
    //6.5.重新计算相关值
    // let allChecked = true
    // let totalPrice = 0
    // let totalNum = 0
    // if (cartList.length != 0) {
    //   cartList.forEach(v => {
    //     if (v.checked) {
    //       totalPrice += v.goods_price * v.num
    //       totalNum += v.num
    //     } else {
    //       allChecked = false
    //     }
    //   })
    // } else {
    //   allChecked = false
    // }
    // //6.4.修改后的数据重新添加到缓存和data中
    // this.setData({
    //   cartList,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    // wx.setStorageSync('cart', cartList)
    this.setCartList(cartList)
  },
  //7.商品数量修改(可以绑定同一个事件，但是加减操作通过点击时的属性来判断)
  async changeClick(e) {
    try {
      //7.2.获取传递过来的数据
      const {goods_id, cnum} = e.currentTarget.dataset
      //7.3.获取购物车数组和修改商品对象
      const cartList = this.data.cartList
      const index = cartList.findIndex(v => v.goods_id === goods_id)
      //7.4.修改数据
      if (cartList[index].num === 1 && cnum === -1) {
        // wx.showModal({
        //   // 标题
        //   // title: '确认',
        //   // 内容
        //   content: '确认从购物车中删除该商品？',
        //   // 成功点击后的反馈
        //   success: res => {
        //     if (res.confirm) {
        //       //点击确认，删除商品
        //       console.log('-------')
        //       cartList.splice(index, 1)
        //       this.setCartList(cartList)
        //       console.log(cartList)
        //     } else {
        //
        //     }
        //   }
        // })
        //封装重构优化
        const res = await showModal({content: '确认从购物车中删除该商品？'})
        if (res.confirm) {
          cartList.splice(index, 1)
        }
      } else {
        //7.4.1.除特殊情况外
        cartList[index].num += cnum
      }
      // cartList[index].num += cnum
      //7.5.将修改后的数据保存给缓存和data
      this.setCartList(cartList)
    } catch (err) {

    }
  },
  //8.全选反选
  allGoodsClick() {
    //8.2.获取allChecked状态
    let {cartList, allChecked} = this.data
    // 8.3.根据allChecked状态进行操作
    // if (allChecked) {
    //   cartList.forEach(v => v.checked = false)
    // } else {
    //   cartList.forEach(v => v.checked = true)
    // }
    allChecked = !allChecked
    cartList.forEach(v => v.checked = allChecked)
    //8.4.将数据给回
    this.setCartList(cartList)
  },
  //封装一个函数，用来计算购物车中相关属性值的改动
  setCartList(cartList) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    if (cartList.length != 0) {
      cartList.forEach(v => {
        if (v.checked) {
          totalPrice += v.goods_price * v.num
          totalNum += v.num
        } else {
          allChecked = false
        }
      })
    } else {
      allChecked = false
    }
    //6.4.修改后的数据重新添加到缓存和data中
    this.setData({
      cartList,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cartList)
  },
  //9.点击结算
  async calcClick() {
    try {
      //9.1.获取收获地址，和用户是否有选中商品
      const {address, totalNum} = this.data
      if (!address) {
        await showToast({title: '请选择收货地址'})
        return
      }
      //9.2.判断用户有没有选购商品
      if (totalNum === 0) {
        await showToast({title: '请您选择要购买的商品'})
        return
      }
      //9.3.跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/pay'
      })
    } catch (e) {

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
    //1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address')
    //3.1.  4.1.获取缓存中的购物车数组数据
    const cartList = wx.getStorageSync('cart') || []
    //4.2.计算every()数组中只要有一个不符合，就返回false
    // const allChecked = cartList.length != 0 ? cartList.every(v => v.checked) : false
    //5
    // let totalPrice = 0
    // let totalNum = 0
    // cartList.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += item.goods_price * item.num
    //     totalNum += item.num
    //   }
    // })
    // // 重构4.2和5.
    // let allChecked = true
    // let totalPrice = 0
    // let totalNum = 0
    // if (cartList.length != 0) {
    //   cartList.forEach(v => {
    //     if (v.checked) {
    //       totalPrice += v.goods_price * v.num
    //       totalNum += v.num
    //     } else {
    //       allChecked = false
    //     }
    //   })
    // } else {
    //   allChecked = false
    // }
    // this.setData({
    //   address,
    //   cartList,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })

    // 利用封装再次重构
    this.setData({
      address
    })
    this.setCartList(cartList)
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