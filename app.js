var config = require("utils/config.js");
var util = require("utils/util.js");

//app.js
App({
  onLaunch: function () {
     
  },
  globalData: {
    userInfo: null,
    appUser: null,
    menus: {
      hidden: true,
      items: [{ name: '我的订单', path: "../pages/order" }, { name: '信息设置', path: "../pages/setting" }]
    }
  }
})