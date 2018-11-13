const v = require("../../utils/validate.js")
var config = require("../../utils/config.js");
var util = require("../../utils/util.js");
var app = getApp();

Page({
  data: { 
    id: 0,
    name: '',
    logo: '',
    mobile: '',
    content: '',
    province: '全部',
    city: '全部',
    area: '全部',
    operatingStartTime: '',
    operatingEndTime: '',
    address: '',
    mobileCode: '',//手动填写的code
    code: '',//系统发送的code
    codeText: '点击获取',
    sendStamp: 0,//发送短信剩余时间，间隔60s
    isShowImg: false,
  },
  onLoad: function (options) { 
  },
  /**提交 */
  formSubmit: function (e) {
    var that = this;
    let data = e.detail.value; 
    console.log(data);
    if(data.logo == ''){
      wx.showToast({
        title: '请输入商户图片',
        icon:'none'
      });
      return false;
    }
    if(data.name.trim() == ''){
      wx.showToast({
        title: '请输入商户名称',
        icon:'none'
      });
      return false
    } 
  },
  /**重置 */
  formReset:function(e){

  },
  /**上传图片 */
  imgUpload: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let localUrl = res.tempFilePaths[0];
        console.log(localUrl);
        that.setData({
          logo:localUrl,
          isShowImg: true
        })
        //上传到服务器
        // util.upload(localUrl, "shop", function (res) {
        //   var data = JSON.parse(res.data);
        //   // var model = that.data.model;
        //   // that.image = config.imgHost + data.path;
        //   that.setData({
        //     logo: config.imgHost + data.path,
        //     isShowImg: true
        //   });
        // });
      },
    })
  },
  /* 获取输入的手机号码 */
  blurMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  //发送短信验证码
  tapCode: function () {
    var that = this;
    if (that.data.sendStamp > 0) {
      wx.showToast({
        icon: "none",
        title: "还有" + that.data.sendStamp + "秒才能再次发送！"
      });
      return false;
    }
    var code = util.createCode(4, false);
    var mobile = that.data.mobile;
    console.log(code, !mobile);
    if (!mobile) {
      util.error('请填写手机号码！');
      return false;
    }
    if (!util.isMobile.test(mobile)) {
      util.error('请输入正确的手机号码！');
      return false;
    }
    //间隔60秒再次发送
    var time = 60;
    var inte = setInterval(function () {
      time--;
      if (time > 0) {
        that.setData({
          sendStamp: time,
          codeText: time + '秒后再次发送'
        });
      } else {
        that.setData({
          sendStamp: 0,
          codeText: '点击获取'
        });
        clearInterval(inte);
      }
    }, 1000);
    //发送短信
     
  },
  bindRegionChange: function (e) { 
    this.setData({
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2]
    })
  },
  bindStartTimeChange: function (e) { 
    this.setData({
      operatingStartTime: e.detail.value
    });
  },
  bindEndTimeChange: function (e) { 
    this.setData({
      operatingEndTime: e.detail.value
    });
  },
})