module.exports = {
  // 是否为空
  isNull: function (data) {
    if (!data.length) {
      return true
    } else {
      return false
    }
  },
  // 是否为邮箱
  isEmail: function (data) {
    if (data.length != 0) {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    }
  },
  // 是否为手机号
  isPhone: function (data) {
    if (data.length != 0) {
      let reg = /^1[34578]\d{9}$/;
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    }
  },
  // 是否为中文字符
  isChinese: function (data) {
    if (data.length != 0) {
      let reg = [\u4e00 - \u9fa5];
      if (!reg.test(data)) {
        return false
      } {
        return true
      }
    }
  },
  // 表单是否完整   data为form数据，dataName为key对应的描述 var dataName = {'desc' : '描述','title' : '标题',...};
  required: function (data,dataName) {
    for (let key in data) {
      data[key] = data[key].replace(/ /g, '');
      if (!data[key]) {
        var name = dataName[key];
        wx.showModal({
          title: '提示',
          content: '请完善' + name +'信息',
          showCancel: false,
        })
        return false
      }
    }
    return true
  }
}