/**
 * @Author: Fan
 * @Date: 2021-12-11 17:10:01
 * @LastEditTime: 2021-12-27 17:30:04
 * @LastEditors: your name
 * @Description: 封装消息提示 减少代码量
 * @FilePath: \vue后台管理\src\assets\js\message.js
 * @焯!
 */
import { Message } from 'element-ui'

/**
 * @description:消息提示的封装
 * @param {String} type
 * @param {String} content
 * @param {any} callback
 * @return {Message}
 */
export default function message (type, content, callback) {
  const attr = {
    showClose: true,
    message: content,
    center: true
  }
  if (callback) {
    callback()
  }
  if (type === 'error') {
    // 失败
    return Message.error(attr)
  } else if (type === 'success') {
    // 成功
    return Message.success(attr)
  } else if (type === 'info') {
    // 正常
    return Message.info(attr)
  } else if (type === 'warning') {
    // 警告
    return Message.warning(attr)
  }
}
