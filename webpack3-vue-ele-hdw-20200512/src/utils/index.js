import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 获取当前时间 年-月-日 时-分-秒
 */
export function nowTime () {
  var date = new Date()
  var Y = date.getFullYear() + '年'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  var D = date.getDate() + '日 '
  var h = date.getHours() + '时'
  var m = date.getMinutes() + '分'
  var s = date.getSeconds() + '秒'
  return Y + M + D + h + m + s
}
/**
 * 直接添加字符串为单位
 */
export function addUnit (val, str) {
  if ((val % 1) > 0) {
    if ((val + '').split('.')[1].length > 2) {
      return val.toFixed(2) + '' + str
    }
  } else {
    return val + '' + str
  }
}
/**
 * 字节单位
 */
export function toByte (val) {
  if (val < 1024) {
    return val + 'bytes'
  } else if (val < 1024 * 1024) {
    return (val / 1024).toFixed(2) + 'KB'
  } else if (val < 1024 * 1024 * 1024) {
    return (val / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (val / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}
/**
 * 修改时间戳为 年-月-日 时-分-秒
 */
export function toTime (val) {
  val = parseInt(val)
  var date = new Date(val)
  console.log(date)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + '：'
  var m = date.getMinutes() + '：'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
