// pages/double/double.js
const $ = require('../../utils/common.js')
var amapFile = require('../../libs/amap-wx.js');
var app = getApp()
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
         img: getApp().globalData.img,
         latitude:'',
         longitude:'',
         latlngjson1:{latitude:'',longitude:''},
         latlngjson2:{latitude:'',longitude:''},
         latitude2:'',
         longitude2:'',
         state:false,
         showShare:false,
         user:true,
         map:false,
         num:'2',
         invite:true,
         UserInfo:[{id:'vega',img:'',location:[{latitude:'12334'},{longitude:'2'}]},
                   {id:'cowboy',img:'',location:[{latitude:'134'},{longitude:'21'}]},
                  ],
         markers: [{
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
                  talk:[
                  {id:'0',type:"text",msg:'heiwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'},
                  {id:'1',type:"text",msg:'hei'},
                  {id:'1',type:"text",msg:'hei2'},
                  {id:'1',type:"text",msg:'hei2'},
                  ],
        circles:{latitude:0,longitude:0,color:'#000000AA',fillColor:'#000000AA',radius:0,strokeWidth:0},
        invitation:false,
        scale:18,
        roomId:'',
        roomSort:'0',
        msgList:[],
        share:false,
        headImgUrl1:'',
        headImgUrl2:'',
        tips:true,
        roomState:false,
        input:'',
        moveTo:'',
        inputType:'record',
        text:false,
        keyboard:false,
        box:{close_box:true,icon_box:true,tool:true},
        distance: '0',
        cost: '',
        polyline: [],
        compass:'',
        info:'',
        showMarkers:false,
        video:true,
        demo: false,
        meeted:false,
        near:false,                             

  },
  meeted(){
    var that = this
    var demo = that.data.demo
    var meeted = that.data.meeted
    var map = that.data.map
    meeted = demo = map=true
    that.setData({meeted,demo,map})
  },
  near(){
    var that = this
    var near = that.data.near
    var demo = that.data.demo
    near = demo =true
    that.setData({near,demo})
  },
  endTalk(e){
    var that = this
    that.demo()
    var _url = 'https://www.korjo.cn/KorjoApi/DeleteMituRoom'
    var _dataJson = {id:4}
    getApp().saveUserData(_url,3,_dataJson,function(re){
      if(!re.data){
        wx.removeStorageSync('roomId')
        wx.showToast({
          title: '已退出',
          icon: 'success',
          duration: 2000
        })
      }
      console.log('guanbiliaotian',_url,_dataJson)
      $.goPage(e)
    })
  },
  // btn_no(){
  //   var that = this
  //   var near = that.data.near
  //   var demo = that.data.demo
  //   var meeted = that.data.meeted
  //   near = demo = meeted =false
  //   that.setData({near,demo,meeted})
  // },
  btn_yes(){
    var that = this
    // var near =that.data.near
    // var demo =that.data.demo
    // var meeted = that.data.meeted
    that.setData({
      near:false,
      meeted:true
    })

  },
  demo(){
    var that = this
    var near = that.data.near
    var demo = that.data.demo
    var meeted = that.data.meeted
    near = meeted = demo=!demo
    
    that.setData({near,meeted,demo})
  },
  takeCall(){
    wx.makePhoneCall({
      phoneNumber: '11110' //仅为示例，并非真实的电话号码
    })
  },
  compass(){
    var that = this
    var compass = that.data.compass
    wx.onCompassChange(function (res) {
      compass = res.direction
      that.setData({compass})
      })
  },
  moveToMap(){
    var that = this
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    that.mapCtx.moveToLocation()
  },
  //获取两点路线距离
  walkRoute(location1,location2,callback){
    const that = this;
        var lat1 = location1.longitude + "," + location1.latitude
          var lat2 = location2.longitude + "," + location2.latitude
    console.log('lat12',lat1,lat2)
          $.ranging(lat1,lat2,function(e){
            var distance = e.data.results[0].distance
            // if(that.data.distance < 20){console.log('distance',that.data.distance)} //测试用
            var near = that.data.near
            var demo = that.data.demo
            var invitation = that.data.invitation
            if(distance <30){
               invitation = demo = near = true
               that.setData({
                  near,
                  demo,
                  invitation,
                })
            }
            console.log('distance',distance)
            that.setData({
              distance:distance,
            })
          })
       // const location = wx.getStorageSync('userLocation');
       // const chosen = wx.getStorageSync('chosenObj');
       //调取高德地图api的步行路线规划
       const myAmapFun = new amapFile.AMapWX({key:'609555a177a2dc78dcb20df2a1292307'});
       console.log('gaodelocation',location1,location2)
       myAmapFun.getWalkingRoute({
          origin: location1.longitude+","+ location1.latitude,
          destination: location2.longitude+","+ location2.latitude,
          success: function(data){
            console.log('gaode1',location1,location2)
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
            console.log('lol',points)
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
  recButton(){
    var that = this 
    var text = that.data.text
    var keyboard = that.data.keyboard
    var box = that.data.box
    if(text){
      text=false
      keyboard = true
    }else{
      text=true
      keyboard = false
    }
    box.close_box = box.icon_box = box.tool = true
    that.setData({
      text,
      keyboard,
      box
    })
  },
  bindfullscreenchange(e){
    var that = this
    var video = that.data.video
    var direction = e.detail.direction
    if(direction =='vertical'){
      that.setData({video:true})
    }
    console.log('eeee',event.detail)
  },
  playVideo(){
    var that = this
    var video = that.data.video
    that.setData({video:false})
    that.videoContext.play()
    that.videoContext.requestFullScreen()
    console.log('video')
  },
  playVoice(e){
    var that = this
    console.log(e)
    var src = e.currentTarget.dataset.src
    // console.log(src)
    wx.downloadFile({
      url: src, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log('cg',res)
            wx.playVoice({
              filePath: res.tempFilePath,
              fail(res){console.log('下载失败',res)}
            })
        }
      },fail(res){console.log('sb',res)}
    })
    //   wx.playVoice({
    //   filePath: 'https://www.korjo.cn/Upload//Korjo/korjotmp/Audio/20180102114318_hb3Ct2.silk',
    //   complete: function(res){
    //     console.log(res)
    //   }
    // })
    // const innerAudioContext = wx.createInnerAudioContext('myAudio')
    //   innerAudioContext.autoplay = true
    //   innerAudioContext.src = src
    //   innerAudioContext.onPlay(() => {
    //       console.log('开始播放')
    //   })
    //   innerAudioContext.onError((res) => {
    //       console.log(res.errMsg)
    //       console.log(res.errCode)
    //   })
  },
  startRecord(){
    var that = this
    // if (wx.getRecorderManager) {
    //   wx.getRecorderManager()
    // } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.startRecord({
        success: function(res) {
          console.log('录音')
      //     const innerAudioContext = wx.createInnerAudioContext()
      // innerAudioContext.autoplay = true
      // innerAudioContext.src = res.data
      // innerAudioContext.onPlay(() => {
      //     console.log('开始播放')
      // })
      // innerAudioContext.onError((res) => {
      //     console.log(res.errMsg)
      //     console.log(res.errCode)
      // })
      wx.playVoice({
              filePath: res.tempFilePath,
              fail(res){console.log('jieguo',res)}
            })
          $.adminUpload(res.tempFilePath,'audio',function(res){
            that.postMsg(getApp().globalData.uploadImg + res.data)
            console.log('音频路径',getApp().globalData.uploadImg + res.data)
          })
          that.setData({Record:false})
          

        },
        fail: function(res) {
           //录音失败
        }
      })

    // }
  },
  stopRecord(){
    var that = this
    wx.stopRecord()
          console.log('结束录音')
    
    that.setData({Record:true})
  },
  previewImage(e){
    console.log('preview',e.currentTarget.dataset.src)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  test(){
    wx.previewImage({
  current: 'http://p.m.fans-me.com/geographyImg/answer_bg2.png', // 当前显示图片的http链接
  urls: ['http://p.m.fans-me.com/geographyImg/answer_bg2.png'] // 需要预览的图片http链接列表
})
  },


  // close_box(){
  //   this.hiddenBox("close_box")
  // },
  // icon_box(){
  //   this.hiddenBox("icon_box")
  // },
  // tool(){
  //   this.hiddenBox("tool")
  // },
  hiddenBox(e){
    var that = this
    // var close_box = that.data.close_box
    // var icon_box = that.data.icon_box
    // var tool = that.data.tool
    var a = e.currentTarget.dataset.box
    var box = that.data.box
    console.log(e)

    switch(a)
        {
        case 'close_box':
        if(box.close_box){
          box.tool = box.icon_box = true
          box.close_box =false
        }else{
          box.close_box =true
        }
          console.log('底部弹窗错误',a)

          break;
        case 'icon_box':
        if(box.icon_box){
          box.tool = box.close_box= true
           box.icon_box =false
        }else{
          box.icon_box =true
        }

          break;
        case 'tool':
         if(box.tool){
           box.icon_box =box.close_box= true
           box.tool =false
        }else{
          box.tool =true
        }
        default:
          console.log('底部弹窗错误',a)
        }

      
        that.setData({box})
  },
  chooseVideo() {
        var that = this
        wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
      camera: 'back',
            success: function(res) {
                console.log('视频',res,res.tempFilePath)
                $.adminUpload(res.tempFilePath,'movie',function(res){
                  that.postMsg(getApp().globalData.uploadImg + res.data)
                  console.log('视频路径',getApp().globalData.uploadImg + res.data)
                })
            }
        })
    },
  chooseImage(){
    var that = this
    wx.chooseImage({
      count: 2, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        $.adminUpload(tempFilePaths[0],'image',function(res){
          that.postMsg(getApp().globalData.uploadImg + res.data)
          console.log('图片路径',getApp().globalData.uploadImg + res.data)
        })
        that.setData({})
        console.log('tempFilePaths tempFilePaths tempFilePaths',tempFilePaths)
      }
    })
  },
  send(e,picture){
    var that = this
    var input = that.data.input = e.detail.value
    that.postMsg(input)
    input = ''
    that.setData({ input })

  },
  postMsg(message){
    var that = this
    var roomId = that.data.roomId
    var url = 'https://www.korjo.cn/KorjoApi/SaveMituMsg'
    var tyle = 2
    var json = { message:'',roomid:roomId,expressionid:1, userid:getApp().globalData.talkId, }
    json.message = message
    // console.log(json)
    getApp().saveUserData(url,tyle,json,function(res){
        that.checkRoom(function(res){
          console.log('res',res)
        })
        console.log('保存消息成功',res)
      })
  },
  talk(){
    var that = this
    var talk = that.data.talk
    var box = that.data.box
    box.close_box = box.icon_box = box.tool =true
    // talk.push({id:'1',type:"picture",msg:'/images/face.gif'},)
    // console.log(this.data.talk)
    that.setData({
      talk,
      box
    })

//     wx.chooseImage({
//   count: 1, // 默认9
//   sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
//   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//   success: function (res) {
//     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
//     var tempFilePaths = res.tempFilePaths
//     console.log('tempFiles',res.tempFiles)
//   }
// })
  },

  accept(){
    this.setData({
      invite:true,
      map:false
    })
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function(res) {
    //     var latitude2 = res.latitude
    //     var longitude2 = res.longitude
    //     var speed2 = res.speed
        var accuracy2 = res.accuracy
    //     that.setData({
    //       latitude2:latitude,
    //       longitude2:longitude
    //     })
    //   }
    // })


  },

  location(e){
    var that = this
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    var roomId = that.data.roomId
    var markers = that.data.markers
         // wx.getLocation({
         //    type:'gcj02',
         //    success(res){
         //      latitude = res.latitude
         //      longitude = res.longitude
         //      console.log('location',res)
         //      that.setData({
         //        latitude,longitude
         //      })
              if(roomId){
              wx.request({
                    url:'https://www.korjo.cn/KorjoApi/GetMituRoomByID',
                    data:{
                      id:roomId
                    },
                    header:{
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method:'POST',
                  success(res){
                    console.log('房间id',roomId)
                        res.data.latlngjson = JSON.parse(res.data.latlngjson)
                        
                      
                      // console.log(typeof res.data.latlngjson[0].location1[0].latitude)
                      
                      
                      // res.data.latlngjson[0].location2[0]   = JSON.parse(res.data.latlngjson[0].location2[0] )
                      
                      if(that.data.talkId1 == getApp().globalData.talkId){
                        // console.log('织女',res.data.latlngjson[0].idCard,that.data.talkId1,getApp().globalData.talkId)
                        
                        // markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
                        // markers[1].longitude = res.data.latlngjson[1].location2[0].longitude
                        markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
                        markers[1].longitude = res.data.latlngjson[1].location2[0].longitude

                        // res.data.latlngjson[0].location1 = JSON.parse(res.data.latlngjson[0].location1)
                        // console.log( 'typeof',  res.data.latlngjson[0].location1)
                        // console.log(typeof res.data.latlngjson[0].location1)
                        res.data.latlngjson[0].location1[0].latitude = markers[0].latitude = latitude
                        res.data.latlngjson[0].location1[0].longitude = markers[0].longitude = longitude
                        // console.log('1001',res.data.latlngjson[0].location1.latitude)
                        

                        // var _location1 = JSON.stringify({latitude:latitude,longitude:longitude})
                        // var _location2 = JSON.stringify({latitude:markers[1].latitude,longitude:markers[1].longitude})
                        var _location1 = [{latitude:latitude,longitude:longitude}]
                        var _location2 = [{latitude:markers[1].latitude,longitude:markers[1].longitude}]
                        // console.log(_location1,_location2,1,roomId)

                        that.creatRoom(_location1,_location2,'1',roomId,that.data.talkId1,that.data.talkId2)
                        // console.log('111',_location1,_location2,1,roomId,that.data.talkId1,that.data.talkId2)


                      }else{
                        console.log('牛郎',res)
                        markers[0].latitude = res.data.latlngjson[0].location1[0].latitude
                        markers[0].longitude = res.data.latlngjson[0].location1[0].latitude
                        // console.log(  res.data.latlngjson[1].location2)
                        // res.data.latlngjson[1].location2 = JSON.parse(res.data.latlngjson[1].location2)

                        res.data.latlngjson[1].location2[0].latitude = markers[1].latitude = latitude
                        res.data.latlngjson[1].location2[0].longitude = markers[1].longitude  = longitude
                        var _location1 = [{latitude:markers[0].latitude,longitude:markers[1].longitude}]
                        var _location2 = [{latitude:latitude,longitude:longitude}]
                        
                        that.creatRoom(_location1,_location2,1,roomId,that.data.talkId1,that.data.talkId2)

                      }
                      that.setData({markers})
                      console.log('that.data.markers[0]',that.data.talkId1,that.data.talkId2,getApp().globalData.talkId)
                      
                    }
                  
                  })
                     getApp().getUserInfo(function(){that.updataRoomInfo(that.roomId)})
            }
            // else{
            //   console.log('roomidnot')
            //   markers[0].latitude = latitude
            //   markers[0].longitude = longitude
            //   markers[0].iconPath = getApp().globalData.avatarUrl
            //   that.setData({
            //     markers
            //   })
            // }
//               if(!e ){//!e && !roomId
//                   wx.request({
//                     url:'https://www.korjo.cn/KorjoApi/GetMituRoomByID',
//                     data:{
//                       id:36
//                     },
//                     header:{
//                     'content-type': 'application/x-www-form-urlencoded'
//                   },
//                   method:'POST',
//                   success(res){
//                     res.data.latlngjson = JSON.parse(res.data.latlngjson)
//                     console.log('织女',res.data)
//                     markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
//                     markers[1].longitude = res.data.latlngjson[1].location2[0].longitude

//                     res.data.latlngjson[0].location1 = JSON.parse(res.data.latlngjson[0].location1)
//                     // res.data.latlngjson[0].location1.longitude= JSON.parse(res.data.latlngjson[0].location1.longitude)
//                     console.log('room',res)
//                     console.log('WOWOWOWO',res.data.latlngjson[0].location1.longitude,'1')
//                     console.log('room',res.data.latlngjson[0].location1.latitude)
//                     res.data.latlngjson[0].location1.latitude = latitude
//                    res.data.latlngjson[0].location1.longitude = longitude

//                    var _location1 = JSON.stringify({latitude:latitude,longitude:longitude})
//                    var _location2 = JSON.stringify({latitude:markers[1].latitude,longitude:markers[1].longitude})
//                    console.log(_location1,_location2,1,roomId)
//                     that.creatRoom(_location1,_location2,1,36)
//                   }
//                   })
//                 }else{
//                   wx.request({
//                     url:'https://www.korjo.cn/KorjoApi/GetMituRoomByID',
//                     data:{
//                       id:36
//                     },
//                     header:{
//                     'content-type': 'application/x-www-form-urlencoded'
//                   },
//                   method:'POST',
//                   success(res){
//                     res.data.latlngjson = JSON.parse(res.data.latlngjson)
//                     console.log( '牛郎',res.data)
//                     markers[0].latitude = res.data.latlngjson[0].location1[0].latitude
//                     markers[0].longitude = res.data.latlngjson[0].location1[0].latitude

//                     // res.data.latlngjson[1].location2 = JSON.parse(res.data.latlngjson[1].location2)
// // console.log('_location2',res.data.latlngjson[1].location2)
// // console.log('_location2', res.data.latlngjson[1].location2[0].latitude)
//                     res.data.latlngjson[1].location2[0].latitude = latitude
//                     res.data.latlngjson[1].location2[0].longitude = longitude
//                     var _location1 = JSON.stringify({latitude:markers[0].latitude,longitude:markers[1].longitude})
//                     var _location2 = JSON.stringify({latitude:latitude,longitude:longitude})

//                     console.log(_location1,_location2,1,roomId)
//                     that.creatRoom(_location1,_location2,1,36)
//                   }
//                   })
//                 }
 

        //     }
        // })
    
  },
  // share(){
  //   var that = this
  //   that.setData({
  //       state:true
  //     })
  // },
// 点击头像邀请
  inviteUser(e){
    var that = this
    var value = e.currentTarget.dataset.state
    var state = that.data.state

    var _location1 = [{latitude:that.data.latitude,longitude:that.data.longitude}]
    var _location2 = [{latitude:'1',longitude:'1'}]
    that.creatRoom(_location1,_location2,null,null,null,null,null,null,function(){
      clearInterval(that.b)
      that.b = setInterval(function(){
        that.a()
      },10000)

    })
    that.setData({showShare:true})
  },
  // 取消邀请
  cancel(){},
  // 通过房间信息获取id和经纬度
  getRoomInfo(roomId,callback){
    if(roomId){
      // console.log('roomIdroomId',roomId)
      this.setData({
        roomId
      })
    }
    var that = this
    var markers= that.data.markers
    var talkId = that.data.talkId
    var roomId = that.data.roomId

    wx.request({
      url:'https://www.korjo.cn/KorjoApi/GetMituRoomByID',
      data:{
        id : roomId,
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      success(res){
          res.data.latlngjson = JSON.parse(res.data.latlngjson)
        console.log('callback',res)
        // zaconsole.log('roominfo',res.data.latlngjson[1].location2[0])
        callback(res)
      }
    })
  },
  creatRoom(_location1,_location2, _sort,_id,talkId1,talkId2,headImgUrl1,headImgUrl2,callback){
    // 创建聊天室，_id：后台房间id，默认0；_location1，_location2：josn对象。包含身份和坐标；sort：【0：等待，1：连接；2：关闭。;talkId1:自己身份id;talkId2:他人身份id】
    var that = this
    var markers = that.data.markers
    var location1 = _location1
    var location2 = _location2
    // var location2 = [{latitude:markers[1].latitude,longitude:markers[1].longitude}]
    
    var a = [{s:'1',l:[{a:'1'},{b:'2'}]},{s:'1',l:[{a:'1'},{b:'2'}]}]
    if(! _id){
      var latlngjson_msg = [{idCard:Number(getApp().globalData.talkId),location1:location1,headImgUrl:getApp().globalData.avatarUrl},{idCard:Number(0),location2:location2,headImgUrl:''}]  //getApp().globalData.talkId          
      latlngjson_msg = JSON.stringify(latlngjson_msg)
      var _json = {roomId:'0',latlngjson:latlngjson_msg,sort:'0'}
    }else{
      // that.getRoomInfo(_id,function(e){


      // })
      var latlngjson_msg = [{idCard:talkId1,location1:location1,headImgUrl:headImgUrl1},{idCard:talkId2,location2:location2,headImgUrl:headImgUrl2}]  //getApp().globalData.talkId          
      latlngjson_msg = JSON.stringify(latlngjson_msg)
      // console.log('latlngjson_msg',talkId1,talkId2,latlngjson_msg)
      var _json = {roomId:'0',latlngjson:latlngjson_msg,id:_id,sort:_sort}
    }
    _json = JSON.stringify(_json)
    console.log('json',_json)
     // console.log(latlngjson_msg)

    wx.request({
      url:'https://www.korjo.cn/KorjoApi/SaveMituRoom',
      data:{
        dataJson : _json,
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      success:function(result){
        var id = JSON.parse(result.data.replace(/[()]/g,'')).data;
        // console.log('data',id)
        if(id){
          that.setData({
            roomId:id
          })
          callback()
        }
        console.log( '更新聊天室',result);
       }
    })
  },
    // 定时更新经纬度，房间状态
  updataRoomInfo(){
    var that = this
    var roomId = that.data.roomId
    var roomSort = that.data.roomSort
    var markers = that.data.markers
    var location1 = [{latitude:that.data.markers[0].latitude,longitude:that.data.markers[0].longitude}]
    var location2 = [{latitude:that.data.markers[1].latitude,longitude:that.data.markers[1].longitude}]
    var talkId1 = ''
    var talkId2 = ''

    console.log('roomId12',roomId)
    // var checkSort = setInterval(function(){


    that.getRoomInfo(roomId,function(e){
      // console.log('111',e)
        // that.checkRoom(
        //   function(checkRoom){
            // var latlngjson = JSON.parse(e.data.latlngjson)
            

            // var a =   e.data.latlngjson[0].idCard
            // var b = e.data.latlngjson[1].idCard
            // console.log('445455',roomId,e,a,b)

            // var _url = e.data.headImgUrl
            //   //对比talkId与本地是否一致
            //   if(a != getApp().globalData.talkId && b ==0){
            //      // _url = e.data.headImgUrl
            //      getApp().saveFiles(_url,markers[1].iconPath,function(){
            //     // that.setData({ markers })
            //           console.log('res.tempFilePath',e.data.headImgUrl  )
            //   })
            //   }else if(b == getApp().globalData.talkId){
            //      // _url = e.data.headImgUrl
            //      getApp().saveFiles(_url,markers[1].iconPath,function(){
            //     // that.setData({ markers })
            //           console.log('res.tempFilePath',e.data.headImgUrl  )
            //   })
            //   }

            //     that.setData({ markers })

              // console.log('url',_url)

              
              // wx.downloadFile({
              //   url: _url, //仅为示例，并非真实的资源
              //   success: function(res) {
              //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              //     if (res.statusCode === 200) {
              //         markers[1].iconPath = res.tempFilePath
              //         that.setData({ markers })
              //         console.log('res.tempFilePath',e.data.headImgUrl  )
              //     }
              //   }
              // })

              
          // })



      // location1 = e.data.latlngjson[0].location1
      // location2 = e.data.latlngjson[1].location2
      
    })
    
      
    // },10000)
    
  },
  // 判断房间状态以及获取消息【并列关系】
  checkRoom(callback){
    var that = this
    var roomSort = that.data.roomSort
    var msgList = that.data.msgList
    var roomId = that.data.roomId 
    var talk = that.data.talk
    // console.log('roomId11',roomId)
    
    wx.request({
      url:'https://www.korjo.cn/KorjoApi/GetMituRoomByID',
      data:{
        id: roomId                                        //当前房间id
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      success(res){
        // console.log(res)
        // msgList = res.data
        // console.log('list',msgList)
        //   that.checkRoom()
        // callback(res)
        // 判断房间状态，如果sort不为0,
        // if(that.data.roomState){
          wx.request({
              url:'https://www.korjo.cn/KorjoApi/GetMituMsgListByID',
              data:{
                id: roomId                                        //当前房间id
              },
              header:{
                'content-type': 'application/x-www-form-urlencoded'
              },
              method:'POST',
              success(res){
                console.log('okokok',res.data)
                var addNum = res.data.length - msgList.length
                var moveTo = msgList.length
                // var moveTo =  that.data.moveTo
                if(addNum){
                  for(var i = 0; res.data.length > msgList.length; i++){
                    msgList.push({id:'',type:"text",msg:'',cls:''},)
                    }
                console.log('moveTo',msgList,msgList.length)

                  $.each(res.data,(i1,v1) => {
                    $.each(msgList,(i2,v2) => {
                        if(i1 > (moveTo-1) || moveTo == 0){
                      console.log('i1',i1,moveTo)
                            if(i1 == i2){
                              v2.msg = v1.message
                              v2.id = v1.userid
                              var a1 = v1.message.indexOf('.png')
                              var a2 = v1.message.indexOf('.jpg')
                              var a3 = v1.message.indexOf('.gif')
                              var b1 = v1.message.indexOf('.mp3')
                              var b2 = v1.message.indexOf('.silk')
                              var c1 = v1.message.indexOf('.mp4')
                              console.log('test2',)
                              if(a1 >0 || a2 >0 || a3 >0){
                                v2.type = 'picture'
                              console.log('消息为图片',a1,a2,a3)
                              }
                              else if(b1 >0 || b2 > 0){
                                v2.type = 'audio'
                                console.log('消息为音频',b1)
                              }
                              else if(c1 >0){
                                v2.type = 'video'
                                console.log('消息为视频',c1)
                              }

                              // if(){}
                              // var a = v1.message.indexOf('.png')
                              // console.log('存在图片',a)
                              if(v1.userid == getApp().globalData.talkId){
                                v2.cls = 'left'
                              }
                              else{
                                v2.cls = 'right'
                              }
                            }
                        }
                    })
                  })
                  moveTo = res.data.length - addNum
                  that.setData({
                      msgList,
                      moveTo
                    })

                }
                  console.log('msgList',msgList,msgList.mis)
                }
    
            })
        // }
        callback&&callback(res)

      }
    })

            

  },
// setInterval(start,time,end){
//   if(!end){
//   var a = setInterval(start,time)
//   }
//   else{
//     clearInterval(a)
//     console.log('111111')
//   }
// },
a(options){
  var that = this 
    var markers = that.data.markers
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    var op = options
    var share = that.data.share
    var roomId = that.data.roomId
    var polyline = that.data.polyline
    var UserInfo = that.data.UserInfo
    var latlngjson2 = that.data.latlngjson2
                console.log('location',latitude,longitude)
              if(roomId){
                    that.checkRoom(function(e){
                      
                      var latlngjson = JSON.parse(e.data.latlngjson)
                      e.data.latlngjson = JSON.parse(e.data.latlngjson)
                      
                      console.log('ae',e)
                      var talkId1 = latlngjson[0].idCard
                      var talkId2 = latlngjson[1].idCard
                      // console.log('车库 ',e)
                      var url_1 = e.data.latlngjson[0].headImgUrl
                      var url_2 = e.data.latlngjson[1].headImgUrl
                      
                      // console.log('url_1',url_1,url_2,e.data.latlngjson)
                      that.setData({
                        talkId1,talkId2
                      })
                      // var markersData=[
                      //             {
                      //                id: '',
                      //                latitude: e.data.latlngjson[0].location1[0].latitude,
                      //                longitude: e.data.latlngjson[0].location1[0].longitude,
                      //                iconPath: '',
                      //                width: '',
                      //                height: ''
                      //             },
                      //             {
                      //                id: '',
                      //                latitude: e.data.latlngjson[1].location2[0].latitude,
                      //                longitude: e.data.latlngjson[1].location2[0].longitude,
                      //                iconPath: '',
                      //                width: '',
                      //                height: ''
                      //             },
                      //             {
                      //                id: '',
                      //                latitude: latitude,
                      //                longitude: longitude,
                      //                iconPath: '',
                      //                width: '',
                      //                height: ''
                      //             }
                      //             ]
                       
                        //身份2与本地身份一致
                        if( (latlngjson[1].idCard == getApp().globalData.talkId) || (talkId1 != getApp().globalData.talkId && latlngjson[1].idCard == 0) ){
                                var talkId2 = getApp().globalData.talkId
                                if(!polyline.length){
                                      var location1 = {longitude,latitude}
                                      console.log('lol',longitude,latitude)
                                      var location2 = e.data.latlngjson[0].location1[0]
                                      that.walkRoute(location1,location2,function(res){
                                        // var polyline = that.data.polyline
                                        // console.log(res,polyline)
                                        // // markers[0].longitude = polyline[0].points.longitude
                                        // // markers[0].latitude = polyline[0].points.latitude
                                        // console.log('walkRoute',res)
                                        // that.setData({markers})
                                        markers[1].latitude = e.data.latlngjson[0].location1[0].latitude
                                    markers[1].longitude = e.data.latlngjson[0].location1[0].longitude
                                    markers[0].latitude = latitude
                                    markers[0].longitude  = longitude
                                      })
                                    }

                                    console.log('牛郎',)
                                    var marks = []
                                    // var markersData=[
                                    //   {
                                    //      id: '0',
                                    //      latitude: e.data.latlngjson[0].location1[0].latitude,
                                    //      longitude: e.data.latlngjson[0].location1[0].longitude,
                                    //      iconPath: '',
                                    //      width: '',
                                    //      height: ''
                                    //   },
                                    //   // {
                                    //   //    id: '',
                                    //   //    latitude: e.data.latlngjson[1].location2[0].latitude,
                                    //   //    longitude: e.data.latlngjson[1].location2[0].longitude,
                                    //   //    iconPath: '',
                                    //   //    width: '',
                                    //   //    height: ''
                                    //   // },
                                    //   {
                                    //      id: '1',
                                    //      latitude: latitude,
                                    //      longitude: longitude,
                                    //      iconPath: '',
                                    //      width: '',
                                    //      height: ''
                                    //   }
                                    //   ]
                                    var marker_item = [0,1]

                                    for ( var marker_item in markers)
                                         {
                                           console.log("item=" + marker_item);
                                           id:marker_item
                                           marks.push(markers);
                                         }
                                    console.log('marks',marks)

                                    markers[1].latitude = e.data.latlngjson[0].location1[0].latitude
                                    markers[1].longitude = e.data.latlngjson[0].location1[0].longitude
                                    markers[1].id = 1
                                    markers[1].width = 20
                                    markers[1].height = 20
                                    markers[1].iconPath = '/images/end.png'

                                    console.log( typeof e.data.latlngjson[1].location2)
                                    console.log(  e.data.latlngjson[1].location2)
                                    var rad = Math.random()
                                    markers[0].latitude = latitude
                                    markers[0].longitude  = longitude
                                    markers[0].id  = 0
                                    markers[0].iconPath = '/images/start.png'
                                    markers[0].width = 20
                                    markers[0].height = 20

                                      console.log('location2',latitude,longitude, markers)

                                    var _location1 = [{latitude:markers[1].latitude,longitude:markers[1].longitude}]
                                    var _location2 = [{latitude:markers[0].latitude,longitude:markers[0].longitude}]//[{latitude:latitude,longitude:longitude}]
                                    console.log(markers[1].latitude,markers[1].latitude )
                                    UserInfo[0].img = e.data.latlngjson[1].headImgUrl
                                    UserInfo[1].img = e.data.latlngjson[0].headImgUrl
                                    // if(markers[1].iconPath.length == 0){
                                    //     getApp().saveFiles(url_1,function(res){
                                    //     let markers = that.data.markers;
                                    //     markers[1].iconPath = res.tempFilePath
                                    //     that.setData({ markers })
                                    //     })
                                    // }
                                    that.setData({tips:false,invitation:true,roomState:true,markers:markers,showMarkers:true,UserInfo})
                                    // if(!polyline.length){
                                    //   var location1 = e.data.latlngjson[0].location1[0]
                                    //   var location2 = e.data.latlngjson[1].location2[0]
                                    //   that.walkRoute(location1,location2)
                                    // }
                                    that.creatRoom(_location1,_location2,1,roomId,talkId1,talkId2,url_1,getApp().globalData.userInfo.avatarUrl)
                                

                            }
                      if(talkId1 == getApp().globalData.talkId && talkId2 != 0){  
                                if(!polyline.length){
                                      var location1 = e.data.latlngjson[0].location1[0]
                                      var location2 = e.data.latlngjson[1].location2[0]
                                      that.walkRoute(location1,location2,function(res){
                                        // var polyline = that.data.polyline
                                        // console.log(res,polyline)
                                        // // markers[0].longitude = polyline[0].points.longitude
                                        // // markers[0].latitude = polyline[0].points.latitude
                                        // console.log('walkRoute',res)
                                        // that.setData({markers})
                                      })
                                    }
                                var tips = that.data.tips
                                var invitation = that.data.invitation
                                  if(tips){
                                    wx.showToast({
                                      title: '邀请用户已接受',
                                      icon: 'success',
                                      duration: 2000
                                    })
                                    tips =false
                                    that.setData({
                                      invitation:true,
                                      tips,
                                    })
                                  }

                                    console.log('织女',e.data.latlngjson[0].idCard,that.data.talkId1,getApp().globalData.talkId)
                        
                                    markers[1].latitude = e.data.latlngjson[1].location2[0].latitude
                                    markers[1].longitude = e.data.latlngjson[1].location2[0].longitude
                                    markers[1].id = 1
                                    markers[1].iconPath = '/images/end.png'

                                    e.data.latlngjson[0].location1[0].latitude = markers[0].latitude = latitude
                                    e.data.latlngjson[0].location1[0].longitude = markers[0].longitude = longitude
                                    markers[0].id = 0
                                    markers[0].iconPath = '/images/start.png'

                                    // console.log('1001',res.data.latlngjson[0].location1.latitude)
                                    

                                    var _location1 = [{latitude:latitude,longitude:longitude}]
                                    var _location2 = [{latitude:markers[1].latitude,longitude:markers[1].longitude}]
                                    // console.log(_location1,_location2,1,roomId)

                                   

                                    UserInfo[0].img = e.data.latlngjson[0].headImgUrl
                                    UserInfo[1].img = e.data.latlngjson[1].headImgUrl
                                    console.log('男的经纬度',e.data.latlngjson )
                                    // if(markers[1].iconPath.length == 0){
                                    //     getApp().saveFiles(url_2,function(res){
                                    //     let markers = that.data.markers;
                                    //     markers[1].iconPath = res.tempFilePath
                                    //     that.setData({ 
                                    //       markers,
                                    //       tips 
                                    //     })
                                    //     console.log('织女',url_2)
                                    //     console.log('黑',markers[1].iconPath.length)         
                                    //             })
                                    // }
                                    console.log('12345',polyline.length)
                                    // if(!polyline.length){
                                    //   var location1 = e.data.latlngjson[0].location1[0]
                                    //   var location2 = e.data.latlngjson[1].location2[0]
                                    //   that.walkRoute(location1,location2)
                                    // }
                                    that.setData({tips:false,invitation:true,roomState:true,markers,showMarkers:true,UserInfo})
                                      that.creatRoom(_location1,_location2,1,roomId,talkId1,talkId2,getApp().globalData.userInfo.avatarUrl,url_2)
                                  // })
                                
                      }

                      // if( (latlngjson[1].idCard == getApp().globalData.talkId) || (talkId1 != getApp().globalData.talkId && latlngjson[1].idCard == 0) ){
                      //           var talkId2 = getApp().globalData.talkId
                      //           // var _ulr = e.data.latlngjson[1].location2.headImgUrl
                      //           that.getRoomInfo(roomId,function(res){
                      //               console.log('牛郎',res)
                      //               markers[0].latitude = res.data.latlngjson[0].location1[0].latitude
                      //               markers[0].longitude = res.data.latlngjson[0].location1[0].longitude
                      //               console.log( typeof res.data.latlngjson[1].location2)
                      //               console.log(  res.data.latlngjson[1].location2)
                      //               // res.data.latlngjson[1].location2 = JSON.parse(res.data.latlngjson[1].location2)

                      //               res.data.latlngjson[1].location2[0].latitude = markers[1].latitude = latitude
                      //               res.data.latlngjson[1].location2[0].longitude = markers[1].longitude  = longitude
                      //               var _location1 = [{latitude:markers[0].latitude,longitude:markers[1].longitude}]
                      //               var _location2 = [{latitude:latitude,longitude:longitude}]
                      //               console.log(markers[1].latitude,markers[1].latitude )
                                    
                      //               if(markers[1].iconPath.length == 0){
                      //                   getApp().saveFiles(url_1,function(res){
                      //                   let markers = that.data.markers;
                      //                   markers[1].iconPath = res.tempFilePath
                      //                   that.setData({ markers })
                      //                   })
                      //               }
                      //               that.setData({tips:false,invitation:true,roomState:true})
                      //               // if(!polyline.length){
                      //               //   var location1 = e.data.latlngjson[0].location1[0]
                      //               //   var location2 = e.data.latlngjson[1].location2[0]
                      //               //   that.walkRoute(location1,location2)
                      //               // }
                      //               that.creatRoom(_location1,_location2,1,op.roomId,talkId1,talkId2,url_1,getApp().globalData.userInfo.avatarUrl)
                      //           })
                                

                      //       }
                      // if(talkId1 == getApp().globalData.talkId && talkId2 != 0){
                      //           // console.log('织女',res)
                      //           var tips = that.data.tips
                      //             if(tips){
                      //               wx.showToast({
                      //                 title: '邀请用户已接受',
                      //                 icon: 'success',
                      //                 duration: 2000
                      //               })
                      //             }
                      //             // markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
                      //             // markers[1].longitude = res.data.latlngjson[1].location2[0].longitude
                      //             that.getRoomInfo(roomId,function(res){
                      //               console.log('织女',res.data.latlngjson[0].idCard,that.data.talkId1,getApp().globalData.talkId)
                        
                      //               // markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
                      //               // markers[1].longitude = res.data.latlngjson[1].location2[0].longitude
                      //               markers[1].latitude = res.data.latlngjson[1].location2[0].latitude
                      //               markers[1].longitude = res.data.latlngjson[1].location2[0].longitude

                      //               // console.log( res.data.latlngjson[0].location1[0])
                      //               // res.data.latlngjson[0].location1 = JSON.parse(res.data.latlngjson[0].location1)
                      //               // console.log( 'typeof',  res.data.latlngjson[0].location1)
                      //               // console.log(typeof res.data.latlngjson[0].location1)
                      //               res.data.latlngjson[0].location1[0].latitude = markers[0].latitude = latitude
                      //               res.data.latlngjson[0].location1[0].longitude = markers[0].longitude = longitude
                      //               // console.log('1001',res.data.latlngjson[0].location1.latitude)
                                    

                      //               // var _location1 = JSON.stringify({latitude:latitude,longitude:longitude})
                      //               // var _location2 = JSON.stringify({latitude:markers[1].latitude,longitude:markers[1].longitude})
                      //               var _location1 = [{latitude:latitude,longitude:longitude}]
                      //               var _location2 = [{latitude:markers[1].latitude,longitude:markers[1].longitude}]
                      //               // console.log(_location1,_location2,1,roomId)

                      //               // that.creatRoom(_location1,_location2,'1',roomId,that.data.talkId1,that.data.talkId2)
                      //               // console.log('111',_location1,_location2,1,roomId,that.data.talkId1,that.data.talkId2)

                      //               console.log('男的经纬度',res.data.latlngjson )
                      //               if(markers[1].iconPath.length == 0){
                      //                   getApp().saveFiles(url_2,function(res){
                      //                   let markers = that.data.markers;
                      //                   markers[1].iconPath = res.tempFilePath
                      //                   that.setData({ markers })
                      //                   console.log('织女',url_2)
                      //                   console.log('黑',markers[1].iconPath.length)         
                      //                           })
                      //               }
                      //               console.log('12345',polyline.length)
                      //               // if(!polyline.length){
                      //               //   var location1 = e.data.latlngjson[0].location1[0]
                      //               //   var location2 = e.data.latlngjson[1].location2[0]
                      //               //   that.walkRoute(location1,location2)
                      //               // }
                      //                 that.creatRoom(_location1,_location2,1,op.roomId,talkId1,talkId2,getApp().globalData.userInfo.avatarUrl,url_2)
                      //             })
                                
                      // }


                      console.log('markers',that.data.markers)

                                                  })

                            }
                             
},

  onLoad(options){
    var that = this
    var markers = that.data.markers
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    var op = options
    var share = that.data.share
    var roomId = that.data.roomId
    var polyline = that.data.polyline =[]
    // var myAmapFun = new amapFile.AMapWX({key: '高德Key'});
console.log('roomId',roomId,op)
      wx.showLoading({
        title: '正在定位中···',
      })
      that.mapCtx = wx.createMapContext('myMap')
      that.videoContext = wx.createVideoContext('myVideo')
      that.compass()
      getApp().getUserInfo(function(){
        wx.getLocation({
            type:'gcj02',
            success(res){
              wx.hideLoading()
              latitude = res.latitude
              longitude = res.longitude
              // markers[0].latitude = latitude
              // markers[0].longitude = longitude
              // markers[0].iconPath = getApp().globalData.avatarUrl
              // that.walkRoute(res)
              
              that.setData({
                latitude,longitude
              })
              var Storage = wx.getStorageSync('roomId')
              if(op.roomId){
              console.log('Storage',Storage)}
              if(op.roomId || Storage){
                    share = true
                    if(op.roomId){
                      wx.setStorageSync('roomId', op.roomId)
                      console.log('roomIdok',Storage)
                    }else{
                      op.roomId = Storage
                    }

                    that.setData({
                    share:true,
                    roomId:op.roomId,
                    roomSort:1
                                })
                    console.log('ok')
              that.a()
              console.log('now')
              that.b = setInterval(
                function(){
                  that.a()
                },10000)
            }
              

     
                }
                  })

          // that.location(options.roomId)
        
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
  wx.stopCompass()
  clearInterval(that.b)
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
    var that = this
    console.log('this.data.roomId',this.data.roomId)
      this.setData({
        user:true,
      })
      return{
        title:'小织女在手 迷路不再有',
        path:`/pages/double/double?talkId=${getApp().globalData.talkId}&roomId=${that.data.roomId}`,
        success(){
          that.setData({
            state:true
          })
        },
        fail(){}
      }
      // wx.navigateTo({
      //   url: `/pages/double/double?user=${this.data.user}&latitude=${this.data.latitude}&longitude=${this.data.longitude}`
      // })
  }
})