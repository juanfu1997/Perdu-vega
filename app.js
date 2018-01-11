//app.js
// var aldstat = require("./utils/ald-stat.js");
const apiUrl = 'https://www.korjo.cn/KorjoApi/GetSessionKey';
var openid = ''
App({
  globalData: {
    // img:'http://p.m.fans-me.com/VegaImg/'
    img:'/images/',
    uploadImg:'https://www.korjo.cn',
    userInfo:null,
    avatarUrl:'',
    talkId:'',
    // json_data:[{
    //                                                   openid:openid,
    //                                                   nickName:that.globalData.userInfo.nickName,
    //                                                   avatarUrl:that.globalData.userInfo.avatarUrl,
    //                                                   wxpublic_id:'1'
    //                                                 }],
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // this.getUserInfo()
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          const code = res.code
          if(code){
            wx.request({
              url: apiUrl,
                 data: {id: 1, js_code: code},
                 dataType: "json",
                 header: {
                   'content-type': 'application/x-www-form-urlencoded'
                 },
                 success: function(response) {
                   const result = JSON.parse(response.data);
                   // console.log(result);
                   openid = result.openid
                   wx.setStorageSync('user_openid', result.openid);
                 }
            })
          }
          wx.getUserInfo({
            success: function (res) {
              console.log('2',res)
              wx.setStorageSync('info', res)
              that.globalData.userInfo = res.userInfo
              // typeof cb == "function" && cb(that.globalData.userInfo)
                             

              wx.downloadFile({
                                url: that.globalData.userInfo.avatarUrl, //仅为示例，并非真实的资源
                                success: function(res) {
                                  if (res.statusCode === 200) {
                                      that.globalData.avatarUrl = res.tempFilePath
                                      // console.log('11',that.globalData.avatarUrl)
                                      // that.saveUserinfo()
                                      var jsonData='1'
                                      var a ='https://www.korjo.cn/KorjoApi/SaveUserInfo'
                                      var b={
                                                      openId:openid,
                                                      nickName:that.globalData.userInfo.nickName,
                                                      avatarUrl:that.globalData.userInfo.avatarUrl,
                                                      wxpublic_id:'1'}
                                          // b = JSON.stringify(b)
                                      that.saveUserData(a, jsonData,b,function(){
                                      typeof cb == "function" && cb(that.globalData.userInfo)

                                      })
                                      
                                      }
                                    }
                              }) 
              
            }
          })



        }
      })
    }
  },
    saveUserData:function(_url,_dataName,_json,callback){
      var that = this
    if(_dataName==1){
      _json =  JSON.stringify(_json)
      // console.log(_json)
      wx.request({
        url:_url,
         data: {
        jsonData : _json,
        },
        // dataType: "json",
        header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       method:'POST',
       success:function(response){
        that.globalData.talkId = response.data.data
        console.log('用户id',that.globalData.talkId)
        console.log('创建',response)
        callback(response)
       }
      })
    }else if(_dataName == 2){
      _json =  JSON.stringify(_json)
      // console.log(_json)
      wx.request({
        url:_url,
         data: {
        dataJson  : _json,
        },
        // dataType: "json",
        header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       method:'POST',
       success:function(response){
        callback(response)
        console.log(  response);
       }
      })
    }else{
      _json =  JSON.stringify(_json)
      // console.log(_json)
      wx.request({
        url:_url,
         data: {
        id  : _json,
        },
        // dataType: "json",
        header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       method:'POST',
       success:function(response){
        callback(response)
        console.log('guanbiliaotian',response);
       }
      })

    }
  },
    saveFiles(_url,callback){
      // var that = this
      // if(that.data.markers[1].iconPath){}
      wx.downloadFile({
                url: _url, //仅为示例，并非真实的资源
                success: function(res) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                      var tempFilePath = res.tempFilePath
                      console.log('DOWNFILES',res.tempFilePath)
                      callback(res)
                  }
                }
              })
    },
//   saveUserinfo:function(){
//     var that = this
//     // var a = [{s:'1',l:[{a:'1'},{b:'2'}]},{s:'1',l:[{a:'1'},{b:'2'}]}]
//                                       // a = JSON.stringify(a)
//                                       var json_data={
//                                                       // openId:openid,
//                                                       // nickName:that.globalData.userInfo.nickName,
//                                                       // avatarUrl:that.globalData.userInfo.avatarUrl,
//                                                       // wxpublic_id:'1'
                                                     
//                                                        // roomid:'0',
//                                                        //   latlngjson:a,
//                                                        //   id:'34',
//                                                        //   sort:'1'

//                                                       // Post请求，参数：dataJson { "message", "roomid", "expressionid", "userid" }
//                                                       // message:'sdjioudoi',
//                                                       // roomid:'4',
//                                                       // expressionid:'1',
//                                                       // userid:'29'
//                                                     }
//                                           json_data= JSON.stringify(json_data)
//                                           // 后台接受数据为string，需要转换为string对象
//                                                     console.log('json',json_data)
//                                       wx.request({
//                                                 url: 'https://www.korjo.cn/KorjoApi/SaveMituRoom',
//                                                    data: {
//                                                     dataJson  :json_data,
//                                                   },
//                                                   // dataType: "json",
//                                                    header: {
//                                                      'content-type': 'application/x-www-form-urlencoded'
//                                                    },
//                                                   method:'POST',

//                                                    success: function(response) {
//                                                      // const result = JSON.parse(response.data);
//                                                      console.log('info',response);
//                                                      // wx.setStorageSync('user_openid', result.openid);
//                                                    }
//                                               })
//   },


})
