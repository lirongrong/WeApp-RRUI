var config = require("config.js");
var md5 = require("security.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//克隆
function cloneObj(oldObj) { //复制对象方法
  if (typeof (oldObj) != 'object') return oldObj;
  if (oldObj == null) return oldObj;
  var newObj = new Object();
  for (var i in oldObj)
    newObj[i] = cloneObj(oldObj[i]);
  return newObj;
};
function extendObj() { //扩展对象
  var args = arguments;
  if (args.length < 2) return;
  var temp = cloneObj(args[0]); //调用复制对象方法
  for (var n = 1; n < args.length; n++) {
    for (var i in args[n]) {
      temp[i] = args[n][i];
    }
  }
  return temp;
}

const getHeader = function(){
  //添加api验证信息
  var appKey = config.apiConfig.appKey;
  var appSecret = config.apiConfig.appSecret;
  var apiVersion = "1";
  var now = new Date();
  var timeStamp = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  var headers = {};
  headers["X-AppKey"] = appKey;
  headers["X-ApiVersion"] = apiVersion;
  headers["X-TimeStamp"] = timeStamp;
  var strSign = appSecret + "apiVersion" + apiVersion + "appKey" + appKey + "timeStamp" + timeStamp;
  var sign = md5.md5(strSign);
  headers["X-Sign"] = sign;
  //是否登录
  var user = wx.getStorageSync("currentUser");
  if (user) {
    headers["X-Authorization"] = user.token;
  }
  return headers;
}

const requestApi = function(opts){
  var headers = opts.header || getHeader();
  //请求内容类型
  opts.dataType = "json";
  if (!opts.type)
    opts.type = "GET";
  opts.contentType = "application/json";
  if (opts.data && opts.type) {
    var type = opts.type.toUpperCase();
    if (type == "POST" || type == "PUT")
      opts.data = JSON.stringify(opts.data);
  };
  //动态删除为null的参数属性
  for(var key in opts.data){
    if(opts.data[key] == null || typeof(opts.data[key]) == undefined)
      delete opts.data[key];
  }
  var canReq = false;
  var req = function(){
    if (canReq) {
      wx.request({
        url: config.apiConfig.host + opts.url,
        header: headers,
        data: opts.data,
        method: opts.type,
        contentType: opts.contentType,
        success: function (res) {
          //业务异常处理
          if (res.statusCode == 250) {
            wx.showToast({
              title: res.data,
              icon: "none",
              duration: 2000
            })
          }
          else {
            if (opts.success)
              opts.success(res.data);
          } 
        },
        fail: function (res) {
          wx.showToast({
            icon: "none",
            title: "操作失败：" + res.errMsg,
            duration: 3000
          })
          console.log('fail:' + res.errMsg); 
        }
      });
    }
  }
  if(opts.sync){
    var sit = setInterval(function(){
      var appUser = wx.getStorageSync("currentUser");
      if (appUser && appUser.token){
        canReq = true;
        req();
        clearInterval(sit);
      }
    },200);
  }else {
    canReq = true;
    req();
  }
}

const upload = function(path,folder,callback){
  var headers = getHeader();
  headers["Content-Type"] = "multipart/form-data";
  wx.uploadFile({
    url: config.apiConfig.host + "wechat/applet/upload",
    filePath: path,
    name: 'file',
    formData: {
      folder:folder
    },
    header: headers,
    success: function (res) {
      callback(res);
    }
  })
}

//创建随机数
const createCode = function (n, hasLetter){
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    var count = 9;
    if (hasLetter)
      count = 35;
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * count);
      res += chars[id];
    }
    return res;
}
const log = function(args){
  console.log(args);
}
//弹出框
const alert = function(msg, callback){
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 1000,
    success: function () {
      if(callback)
        callback();
    }
  });
}
//错误消息提示
const error = function (msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
  })
}

//正则验证手机号码
const isMobile = /0?(13|14|15|17|18|19)[0-9]{9}/;

//正则验证邮箱
const isEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;

//点击收藏
const tapCollect=function(that,e,callback){ 
  var list = that.data.list;
  var dataset = e.currentTarget.dataset;
  var isCollected = list[dataset.index].isCollected || false;
  //已经收藏则取消收藏
  if (isCollected) { 
    requestApi({
      url: 'product/' + dataset.id + '/uncollect',
      type:'delete',
      success:function(res){
        list[dataset.index].isCollected = !isCollected;
        wx.showToast({
          title: '已取消收藏',
          success: function () {
            that.setData({
              list:list
            });
          }
        });
        if(callback)
          callback(list[dataset.index]);
      }
    });
  } else {
    requestApi({
      url: 'product/collect',
      type: 'post',
      data: {
        productId: dataset.id
      },
      success: function (res) {
        list[dataset.index].isCollected = !isCollected;
        wx.showToast({
          title: '已加入收藏',
          success: function () {
            that.setData({
              list: list
            });
          }
        });
        if (callback)
          callback(list[dataset.index]);
      }
    });
  }
}

//访问
const visit = function(type,id){
  if(type=="product"){
    requestApi({
      url:'product/' + id+ '/visit',
      type:'put'
    });
  }
}

module.exports = {
  formatTime: formatTime,
  requestApi:requestApi,
  upload:upload,
  createCode:createCode,
  log:log,
  alert:alert,
  error:error,
  isMobile:isMobile,
  isEmail: isEmail,
  tapCollect: tapCollect,
  visit:visit,
  extendObj: extendObj
}

