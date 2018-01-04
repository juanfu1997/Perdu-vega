// pages/single/single.js
var amapFile = require('../../libs/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:getApp().globalData.img,
    address:'请输入地址',
    longitude:'',
    latitude:'',
    longitude2:'',
    latitude2:'',
    markers:[],
    polyline:[],
  
  },
  walkRoute(location1,location2,callback){
          console.log('ew')
    const that = this;
       // const location = wx.getStorageSync('userLocation');
       // const chosen = wx.getStorageSync('chosenObj');
       //调取高德地图api的步行路线规划
       const myAmapFun = new amapFile.AMapWX({key:'609555a177a2dc78dcb20df2a1292307'});
       console.log('gaodelocation',location1,location2)
       myAmapFun.getWalkingRoute({
          origin: location1.longitude+","+ location1.latitude,
          destination: location2.longitude+","+ location2.latitude,
          success: function(data){
            console.log('gaode',location1,location2)
               const points = [];
               if(data.paths && data.paths[0] && data.paths[0].steps){
                  var steps = data.paths[0].steps;
                  for(var i = 0; i < steps.length; i++){
                      var poLen = steps[i].polyline.split(';');
                      for(var j = 0;j < poLen.length; j++){
                      points.push({
                         longitude: parseFloat(poLen[j].split(',')[0]),
                         latitude: parseFloat(poLen[j].split(',')[1])
                      });
                  } 
               }
               that.setData({
                  polyline: [{
                    points: points,
                    color: "#0091ff",
                    width: 10,
                    arrowLine:true
                  }],
               });
               callback(data)

            }
          },
          fail: function(info) {}
       });
       // this.setData({
       //     latitude: location1.latitude,
       //     longitude: location1.longitude,
       //     //地图
       //     markers: [{
       //        //iconPath: "../../images/marker.png",
       //        id: 0,
       //        latitude: location1.lat,
       //        longitude: location1.lng,
       //        width: 30,
       //        height: 30,
       //        arrowLine: true
       //     }]//,
       //     // chosen: {
       //     //    title: chosen.title,
       //     //    address: chosen.address
       //     // }
       // });
  },
  address(callback){
    var that = this
    var address= that.data.address
    var longitude2= that.data.longitude2
    var latitude2= that.data.latitude2            
      wx.chooseLocation({
        success(res){
          // var aa = [{a:'1'},{b:'2'}]
          // console.log(aa.length)
          console.log(res)
          address = res.address
          longitude2 = res.longitude
          latitude2 = res.latitude
          that.setData({
            address,
            longitude2,
            latitude2
          })
          callback()
        }
      })
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function(res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var latitude = that.data.latitude
    var longitude =that.data.longitude
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.address(function(){

          that.setData({latitude,longitude})
          var location1 = {latitude:that.data.latitude,longitude:that.data.longitude}
          var location2 = {latitude:that.data.latitude2,longitude:that.data.longitude}
          that.walkRoute(location1,location2,function(res){
            console.log(res)
        })
        
        })
      }
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})