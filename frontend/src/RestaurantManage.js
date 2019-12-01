/*
 * @Author: your name
 * @Date: 2019-11-24 16:41:59
 * @LastEditTime: 2019-11-30 14:04:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\RestaurantManage.js
 */
import React, {Suspense} from 'react';
import {Switch, Link, Route, withRouter} from 'react-router-dom';
import OrderManage from './OrderManage';
import FoodManage from './FoodManage';
import DeskManage from './DeskManage';
import ChangeFood from './ChangeFood';
import AddFood from './AddFood';
import api from './api';
import createFetcher from './create-fetcher';
import history from './history';

import {Menu, Button} from 'element-react'
import './CSS/RestaurantManage.css';


const userInfoFetcher = createFetcher(() => {
    return api.get('/userinfo').catch(() => {
        history.push('/')
    })
})
function RestaurantInfo(){
    var info = userInfoFetcher.read()
    return (
        <div className='restaurant-header'>
            欢迎来到后台：{info.data.title}
        </div>
    )
}

var navStyle = {
    textDecoration: 'none',
    color: '#000'
}
export default withRouter(function (props){
    async function logout(){
        await api.get('/logout');
        props.history.push('/')
    }
    return (
        <div className="restaurant-manage">
            <header>
                <Suspense fallback={<div>Loading...</div>}>
                    <RestaurantInfo />
                </Suspense>
            </header>
            <section>
                <aside>
                    <Menu className="el-menu-vertical-demo" defaultActive='1' style={{backgroundColor:'#E5E9F2', width: '180px'}}>
                        <Link to={`/manage/r/${props.match.params.rid}/order`} style={navStyle}><Menu.Item index="1">订单管理</Menu.Item></Link>
                        <Link to={`/manage/r/${props.match.params.rid}/food`} style={navStyle}><Menu.Item index="2">菜品管理</Menu.Item></Link>
                        <Link to={`/manage/r/${props.match.params.rid}/desk`} style={navStyle}><Menu.Item index="3">桌面管理</Menu.Item></Link>
                        <Menu.Item index="4"><Button onClick={logout}>退出</Button></Menu.Item>
                    </Menu>
                </aside>
                <main>
                    <Switch>
                        <Route path='/manage/r/:rid/order' component={OrderManage} />
                        <Route path='/manage/r/:rid/food' component={FoodManage} />
                        <Route path='/manage/r/:rid/desk' component={DeskManage} />
                        <Route path='/manage/r/:rid/changefood' component={ChangeFood} />
                        <Route path='/manage/r/:rid/addfood' component={AddFood} />
                    </Switch>
                </main>
            </section>
        </div>
    )
})
