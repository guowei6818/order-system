/*
 * @Author: your name
 * @Date: 2019-11-24 15:45:22
 * @LastEditTime: 2019-11-25 09:19:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './set-global';

import App from './App';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
