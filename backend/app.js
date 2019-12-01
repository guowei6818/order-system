/*
 * @Author: your name
 * @Date: 2019-11-22 21:40:17
 * @LastEditTime: 2019-11-28 21:42:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\backend\app.js
 */
const path = require('path')
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const userAccountMiddleware = require('./user-account')
const restaurantMiddleware = require('./restaurant')

const app = express();

app.use((req, res, next) => {
    console.log(req.socket.remoteAddress, req.method, req.url)
    next()
})

app.use(cors({
    origin: true,
    maxage: 86400,
    credentials: true
}))

app.use(session({
    secret: 'secret'
}))
app.use(cookieParser('secret'))

app.use(express.static(path.join(__dirname, "./build")))
app.use(express.static(__dirname + '/static/'))
app.use('/upload', express.static(__dirname + '/upload/'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api', userAccountMiddleware)
app.use('/api', restaurantMiddleware)


module.exports = app