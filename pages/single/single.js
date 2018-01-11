// pages/single/single.js
var amapFile = require('../../libs/amap-wx.js');
const $ = require('../../utils/common.js')
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
    markers:[{
                    iconPath: '/images/start.png',
                    id: 0,
                    latitude: '',
                    longitude: '',
                    width: 20,
                    height: 30,

                    callout:{
                              content:"1111111111111111111",
                              color:"#000",
                              bgColor:'red',
                              display:'ALWAYS',
                            }
                  },
                  {
                    iconPath: '/images/end.png',
                    id: 1,
                    latitude: '',
                    longitude: '',
                    width: 20,
                    height: 30,

                    callout:{
                              content:"222222222222",
                              color:"#000",
                              bgColor:'red',
                              display:'ALWAYS',
                            }
                  }
                  ],
     circles:{latitude:0,longitude:0,color:'#000000AA',fillColor:'#000000AA',radius:0,strokeWidth:0},
    polyline:[],
    compass:'0',
    info:'0',
    scale:18,
  
  },
  changeScale(e){
    console.log('changeScale',e)
    var that = this
    var scale = that.data.scale
    var type = e.currentTarget.dataset.type
    if(type == "big" && scale < 18){
      scale++
    }else if(type == "small"){
      scale--
    }
    that.setData({scale})
  },
  hiddenBox(){
    wx.showModal({
      title: '',
      content: '是否推出地图',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  takeCall(){
    wx.makePhoneCall({
      phoneNumber: '11110' //仅为示例，并非真实的电话号码
    })
  },
  moveToMap(){
    var that = this
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    that.mapCtx.moveToLocation()
  },
  compass(){
    var that = this
    var info = that.data.info
    var compass = that.data.compass
    wx.onCompassChange(function (res) {
      compass = res.direction
      that.setData({compass})
    })
  },
  walkRoute(location1,location2,callback){
          console.log('ew',location1,location2)
          var lat1 = location1.longitude + ',' + location1.latitude
          var lat2 = location2.longitude + ',' + location2.latitude
          $.ranging(lat1,lat2,function(e){
            var distance = e.data.results[0].distance
            console.log('info',distance)
            that.setData({info:distance})
          })
    const that = this;
       // const location = wx.getStorageSync('userLocation');
       // const chosen = wx.getStorageSync('chosenObj');
       //调取高德地图api的步行路线规划
       const myAmapFun = new amapFile.AMapWX({key:'8a81a5854ec1d62694cde783692a71de'});
       console.log('gaodelocation',location1,location2)
       myAmapFun.getWalkingRoute({
          origin: location1.longitude+","+ location1.latitude,
          destination: location2.longitude+","+ location2.latitude,
          success: function(data){
            console.log('gaode',data)
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
               console.log(that.data.polyline.length)
               if(that.data.polyline.length){
               var a = points[0].longitude - that.data.polyline[0].points[0].longitude
               var b = points[0].latitude - that.data.polyline[0].points[0].latitude
               console.log('aa',a+b)
               if(a+b > 0.1){
                console.log('points',points)
               that.setData({
                  polyline: [{
                    points: points,
                    color: "#0091ff",
                    width: 10,
                    arrowLine:true
                  }],
               });
               }
              }
               console.log('points',points)
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
  address(){
    var that = this
    var address= that.data.address
    var longitude2= that.data.longitude2
    var latitude2= that.data.latitude2
    var markers =that.data.markers
    // var latitude = that.data.latitude
    // var longitude =that.data.longitude            
      wx.chooseLocation({
        success(res){
          // var aa = [{a:'1'},{b:'2'}]
          // console.log(aa.length)
          console.log('dizhi',res)
          clearInterval(that.b)
          // var a = res.longitude - that.data.longitude
          // var b = res.latitude - that.data.latitude
          // console.log('ab',a,b)
          // if(){}
          address = res.address
          markers[1].longitude = longitude2 = res.longitude
          markers[1].latitude = latitude2 = res.latitude

          that.setData({
            address,
            longitude2,
            latitude2,
            markers
          })
          var location1 = {latitude:that.data.latitude,longitude:that.data.longitude}
          var location2 = {latitude:that.data.latitude2,longitude:that.data.longitude2}
          that.walkRoute(location1,location2,function(res){
            console.log(res)
        })
          that.b = setInterval(function(){
          that.walkRoute(location1,location2,function(res){
            console.log('1',res)
        })
        },5000)
          // callback()
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
    var markers = that.data.markers
    wx.showLoading({
      title: '定位中···',
    })
    that.mapCtx = wx.createMapContext('myMap')
    that.compass()

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        wx.hideToast()
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        markers[0].latitude = latitude
        markers[0].longitude = longitude
          that.setData({latitude,longitude,markers})



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
  wx.stopCompass()
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