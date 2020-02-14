/*
 * @Author: your name
 * @Date: 2019-11-24 15:45:22
 * @LastEditTime : 2020-01-12 12:35:07
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\App.js
 */
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import FoodCart from './FoodCart';
import RestaurantManage from './RestaurantManage';
import Login from './Login';
import HomePage from './HomePage';
import history from './history';
import OrderSuccess from './OrderSuccessed';
import Register from './Register';

//element-io组件
import 'element-theme-default';
import 'antd/dist/antd.css';

//用户侧：
// 扫码进入页面，选择人数: /landing/restaurant/r/:rid/desk/:did
// 点餐页面：             /restaurant/r/:rid/desk/d/did/c/:cid
//点餐成功页面：          /r/:rid/d/:did/order-success

//商户侧：登录，注册
//管理页面：/manage/r/:rid
//订单管理：/manage/r/:rid/order
//订单详情：/manage/r/:rid/order/:id
//菜品管理：/manage/r/:rid/food
//桌面管理：/manage/r/:rid/desk

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path='/landing/r/:rid/d/:did' component={LandingPage} />
        <Route path='/r/:rid/d/:did/c/:count' component={FoodCart} />
        <Route path='/r/:rid/d/:did/order-success' component={OrderSuccess} />
        <Route path='/manage/r/:rid' component={RestaurantManage} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    </Router>
  );
}

export default App;
