// pages/dialog/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalTitle: '添加标签',
    modalPlaceHolder: '请填写标签名称',
    modalValue: '', 
    modalId: '',
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
    this.domShowModal = this.selectComponent("#domShowModal")
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

  },

  /**
   * 显示弹层一，有输入框
   */
  onShowDialogOne:function(){
    this.domShowModal.showModal()
    this.setData({
      modalTitle: '添加标签',
      isEdit: false
    })
  },

  /**
   * dialogOne,confirm
   */
  onConfirmOne:function(){
    //do some thing
    console.log("确定一")
  }
})