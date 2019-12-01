/*
 * @Author: your name
 * @Date: 2019-10-13 10:51:48
 * @LastEditTime: 2019-11-24 09:11:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \order-system\backend\db.js
 */
const sqlite = require('sqlite')


const dbPromise = sqlite.open(__dirname + '/db/restaurant.sqlite3')

module.exports = dbPromise

