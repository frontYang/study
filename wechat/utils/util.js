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

/**
 * request 封装
const api = require('../../utils/util.js')

// 单个请求
api.get('list').then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})

// 一个页面多个请求
Promise.all([
  api.get('list'),
  api.get(`detail/${id}`)
]).then(result => {
  console.log(result)
}).catch(e => {
  console.log(e)
})
 */
const { config } = require('./config.js');

const getUrl = (url) => {
  if(url.indexOf('.//' == -1)){
    url = config.baseUrl + url
  }
  return url
}

const http = ({ 
  url = '',  
  param = {},
  ...other
} = {}) => {
  wx.showLoading({
    title: '加载中...',
  })

  let timeStart = Date.now();

  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json'
      },
      ...other,
      complete: (res) => {
        wx.hideLoading();
        console.log(`耗时${Data.now() - timeStart}`);
        if(res.statusCode >= 200 && res.statusCode < 300){
          resolve(res.data)
        }else{
          reject(res)
        }
      }
    })
  })
}

// get方法
const _get = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}



module.exports = {
  formatTime,
  _get,
  _post
}
