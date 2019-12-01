/*
 * @Author: your name
 * @Date: 2019-11-26 16:35:54
 * @LastEditTime: 2019-11-26 16:36:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \order-system\backend\index.js
 */
const app = require('./app')
const server = require('./http-server')
const io = require('./io-server')
const port = 5000

server.on('request', app)

io.desk.attach(server)
io.restaurant.attach(server)

server.listen(port, () => {
  console.log('server listening on port', port)
})