// pages/index/index.js
Page({
    data: {
        img: getApp().globalData.img
    },
    onLoad: function (options) {

    },
    double(){
      wx.navigateTo({
        url: `/pages/double/double`
      })
    },
    single(){
      wx.navigateTo({
        url: `/pages/single/single`
      })
    },
    showQrcode(e) {
        const url = 'http://p.m.fans-me.com/geographyImg/qrcode.jpg'
        wx.previewImage({
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    onShareAppMessage() {
        return {
            title: '科普世界 地理常识',
            path: '/pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})