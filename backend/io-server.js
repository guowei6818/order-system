/*
 * @Author: your name
 * @Date: 2019-11-24 09:45:34
 * @LastEditTime: 2019-11-26 16:33:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \order-system\backend\io-server.js
 */
const socketIO = require('socket.io')

module.exports.restaurant = socketIO({
  path: '/restaurant'
})

module.exports.desk = socketIO({
  path: '/desk'
})