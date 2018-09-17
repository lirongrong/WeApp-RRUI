// component/red-paper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price:{
      type:Number,
      value:''
    },
    note:{
      type:String,
      value:'红包已发送到您的微信账号'
    },
    isHidden:{
      type:Boolean,
      value:true
    },
    onClose:{
      type:Function,
      value:''
    }
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
    onClose:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('onclose', myEventDetail, myEventOption)
    }
  }
})
