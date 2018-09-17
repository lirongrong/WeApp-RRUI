// component/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu:[
      {
        name: '首页',
        url:'../home/index'
      },
      {
        name: '订单管理',
        url:'../order/order'
      },
      {
        name:'菜品管理',
        url:'../menu/type'
      },
      {
        name:'二维码管理',
        url:'../code/index'
      },
      {
        name:'信息设置',
        url:'../setting/information'
      }
    ],
    isSubMenu:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    menuCall:function(){
      this.setData({
        isSubMenu: false
      })
    },
    closeModel:function(){
      this.setData({
        isSubMenu: true
      })
    }
  }
})
