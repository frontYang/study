// component/test/test.js
Component({
  externalClasses: ['component-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    innerText: {
      type: String,
      value: 'default value',
    },
    componentData: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    testData: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
