function request(url, data, method, callback) {
    wx.request({
        url: url,
        data: data,
        method: method,
        header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        dataType: 'json',
        success: function (res) {
            callback && callback(res.data)
        },
        fail: function (res) {
            console.error('request fail:' + url)
            console.error(res)
        },
        complete: function () {

        }
    })
}

function getArrayItems(arr, num) {
    var temp_array = new Array()
    for (var index in arr) {
        temp_array.push(arr[index])
    }
    var return_array = new Array()
    for (var i = 0; i < num; i++) {
        if (temp_array.length > 0) {
            var arrIndex = Math.floor(Math.random() * temp_array.length)
            return_array[i] = temp_array[arrIndex]
            temp_array.splice(arrIndex, 1)
        } else {
            break
        }
    }
    return return_array
}
// function each(arr, fn) {
//     if (arr instanceof Array) {
//         for (let i = 0, len = arr.length; i < len; i++) {
//             if (fn(i, arr[i]) === false) { break; }
//         }
//     } else {
//         for (let i in arr) {
//             if (fn(i, arr[i]) === false) { break; }
//         }
//     }
// }

function each(object, callback) {
    var name, i = 0,
        length = object.length,
        isObj = length === undefined

    if (isObj) {
        for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
                break
            }
        }
    } else {
        for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
    }
    return object
}

String.prototype.find = function (str) {
    if (this.indexOf(str) > -1) {
        return true
    }
    return false
}

function alert(s) {
    // 提示弹层
    wx.showModal({
        title: '提示',
        content: s,
        showCancel: false,
        success: function (res) {

        }
    })
}

function loading() {
    if (wx.showLoading) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
    } else {
        wx.showToast({
            title: "加载中...",
            icon: "loading",
            duration: 100000
        })
    }
}

function hideLoading() {
    if (wx.showLoading) {
        wx.hideLoading()
    } else {
        wx.hideToast()
    }
}

String.prototype.trim = function() {
    // 去除首尾空格
    return this.replace(/(^\s*)|(\s*$)/g, "")
}

function getText(str) {
    // html提取纯文本
    // return str.replace(/<\/?div.*?>|<\/?section.*?>|<\/?p.*?>|<img.*?>|<br.*?\/>|&nbsp;|<\/?span.*?>|<\/?a.*?>|<\/?em.*?>|<\/?strong.*?>|<\/?ul.*?>|<\/?li.*?>|<\/?dl.*?>|<\/?dt.*?>|<\/?dd.*?>|<\/?b.*?>|<\/?h\d.*?>/gi, '').replace(/&#39;/ig, "'")
    return str.replace(/&#39;/ig, "'").replace(/<\/?[^>]*>|&[^;]*;/ig, '')
}

function unique(array) {
    // 数组去重
    const res = []
    const json = {}
    for (let i = 0; i < array.length; i++) {
        if (!json[array[i]]) {
            res.push(array[i])
            json[array[i]] = 1
        }
    }
    return res
}

function log(...s) {
    if (s.length == 1) {
        console.log(s[0])
    } else {
        console.log(s)
    }
}

function extend(target, options) {
    for (let name in options) {
        target[name] = options[name]
    }
    return target
}

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function url2abs(str) {
    // img链接转换为绝对路径
    return str.replace(/<img.*?\ssrc="\//gi, '<img src="http://korjo.fans-me.com/').replace(/&#39;/ig, "'")
}
function param(json) {
    const arr = []
    each(json, (i, v) => {
        arr.push(`${i}=${v}`)
    })
    return arr.join('&')

    // return '?' +
    //     Object.keys(json).map(function (key) {
    //         return encodeURIComponent(key) + '=' +
    //             encodeURIComponent(json[key]);
    //     }).join('&');
}

function goPage(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
        url: `/pages/${data.page}/${data.page}`
    })
}
function saveFiles(_url,callback){
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
}
//上传资源获得其链接 资源类型:image audio movie
function adminUpload(tempUrl, typeOfUpload, callbackWhenSuccess, callbackWhenFail) {
    console.log(typeOfUpload+": "+tempUrl);
    wx.uploadFile({
        url: 'https://korjo.fans-me.com/KorjoApi/AdminUpload',
        filePath: tempUrl,
        name: 'myPostcardPics',
        method: 'POST',
        formData: {
            'path': 'korjotmp',
            'type': typeOfUpload,
        },
        header: {
            'content-type': 'multipart/form-data'
        },
        success: function (res) {
            callbackWhenSuccess(res);
        },
        fail: function (res) {
            callbackWhenFail(res);
        },
        complete(res) {
            console.log(res);
        }
    })
}

module.exports = {
    server: 'https://korjo.fans-me.com/',
    get: function (url, data, callback) {
        let server = this.server
        if (url.indexOf('https://') > -1) {
            server = ''
        }
        request(server + url, data, 'GET', callback)
    },
    post: function (url, data, callback) {
        let server = this.server
        if (url.indexOf('https://') > -1) {
            server = ''
        }
        request(server + url, data, 'POST', callback)
    },
    each,
    alert,
    getText,
    unique,
    loading,
    hideLoading,
    log,
    extend,
    getArrayItems,
    formatTime,
    url2abs,
    param,
    goPage,
    saveFiles,
    adminUpload
}