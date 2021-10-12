// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //组件点击，向父组件传递事件
    tabsClick(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('tabsClick', index)
    }
  }
})
