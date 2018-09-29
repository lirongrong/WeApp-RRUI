var app = getApp();
var util = require('../../utils/util.js');
// component/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idType: {
      type: Number,
      value: 1,//1为正面，2为背面
    },
    placeholder: {
      type: String,
      value: '请输入'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    files: [],//本地上传的图片
    isLoading: false,  //上传图片等待效果
    imageSize: "",//本地上传图片大小
    imageUrl: "",//上传名片的服务器路径
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 上传名片
   */
    chooseImage: function () {
      var that = this;
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths),
            imageSize: res.tempFiles[0].size,
            isLoading: true
          });
          //上传名片
          // wx.uploadFile({
          //   url: app.globalData.erpHost + "Upload/UploadFile",
          //   filePath: res.tempFilePaths[0],
          //   name: 'file',
          //   formData: {
          //     "path": "releaseeasy-auth",
          //   },
          //   header: { "Content-Type": "multipart/form-data" },
          //   success: function (res) {
          //     var data = JSON.parse(res.data);
          //     console.log(data);
          //     that.setData({
          //       imageUrl: data.data,
          //       isLoading: false
          //     });
          //     //名片识别
          //     //that.sysOcrBC();
          //   }
          // })
          //假动作
          setTimeout(function () {
            that.setData({
              isLoading: false
            })
          }, 1000)
        }
      })
    },
    //名片识别
    sysOcrBC: function () {
      var that = this;
      //名片识别
      util.postApi("common/Ocr/SysOcrBC", {
        imageUrl: app.globalData.imgHost + that.data.imageUrl
      },
        function (bcRes) {
          console.log(bcRes);
          that.setData({
            distinguishName: bcRes.data.name,
            distinguishMobile: bcRes.data.tel_cell.lenght > 0 ? bcRes.data.tel_cell[0] : ""
          });
        }, function (errCallbackerr) {
          //名片识别api报错
        })
    },
    //放大查看名片
    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    },
    //删除名片
    removeCard: function (e) {
      var that = this;
      that.setData({
        files: [],
        imageSize: "",
        imageUrl: ""
      });
    },
  }
})
