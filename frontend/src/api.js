/*
 * @Author: your name
 * @Date: 2019-11-24 19:13:08
 * @LastEditTime: 2019-11-24 19:16:51
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\api.js
 */
import axios from 'axios';
import baseURL from './baseURL';

var api = axios.create({
    baseURL: baseURL + 'api',
    withCredentials: true,
})

export default api