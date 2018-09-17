Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: {
      type: String,
      value: 'title',
    },
    placeholder:{
      type:String,
      value:'placeholder'
    }, 
    value:{
      type:String,
      value:''
    },
    modalid:{
      type:String,
      value:''
    }
  },
  data: {
    // 这里是一些组件内部数据
    showModal:false,
    showNotice:false
  },
  methods: {
    //显示modal
    showModal:function(){
      var that = this;
      that.setData({
        showModal: true,
      })
    },
    //隐藏modal
    hideModal: function () {
      var that = this;
      that.setData({
        showModal: false,
        showNotice: false,
        value:''
      })
    }, 
    //取消按钮
    _onCancel: function () {
      var that = this;
      that.hideModal()
    },
    //确定按钮
    _onConfirm: function () {
      var that = this;
      if (typeof (that.data.value) == undefined || that.data.value.trim() == "") {
        that.setData({
          showNotice: true
        })
      } else { 
        that.setData({
          showNotice: false
        })
        var myEventDetail = {
          id: that.data.modalid,
          name: that.data.value
        }; // detail对象，提供给事件监听函数
        that.triggerEvent('confirm', myEventDetail);
        that.hideModal()
      }
    },
    //input框输入时触发
    _inputChange:function(e){ 
      var that = this;
      var value = e.detail.value;
      if(typeof(value) == undefined || value.trim() == ""){
        that.setData({
          showNotice: true
        })
      }else{
        that.setData({
          showNotice: false,
          value:value
        })
      }
    }
  }
})