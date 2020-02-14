/*
 * @Author: your name
 * @Date: 2019-11-24 16:41:59
 * @LastEditTime : 2020-02-14 15:12:15
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\RestaurantManage.js
 */
import React, {Suspense} from 'react';
import {Switch, Link, Route, withRouter} from 'react-router-dom';
import OrderManage from '../OrderManage';
import FoodManage from '../FoodManage';
import DeskManage from '../DeskManage';
import AddFood from '../AddFood';
import api from '../api';
import createFetcher from '../create-fetcher';
import history from '../history';

import {Menu, Layout, Icon, Avatar} from 'antd';
import './index.css';
const { Header, Content, Sider } = Layout;

const userInfoFetcher = createFetcher(() => {
  return api.get('/userinfo').catch(() => {
    history.push('/')
  })
})
const RestaurantInfo = (props) => {
  const { logout } = props;
  const info = userInfoFetcher.read()
  return (
    <div className='restaurant-header'>
        欢迎来到后台：{info.data.title}
      <span className="user-login">
        <Avatar icon="user" /><a className='logout' onClick={() => logout()}>退出</a>
      </span>
    </div>
  )
}

var navStyle = {
    textDecoration: 'none',
    color: '#fff'
}
export default withRouter(function (props){
  const logout = async() => {
    await api.get('/logout');
    props.history.push('/')
  }
  
  return (
    <div className="restaurant-manage">
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" >后台管理</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to={`/manage/r/${props.match.params.rid}/food`} style={navStyle}>
              <Icon type="home" />菜品管理
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={`/manage/r/${props.match.params.rid}/order`} style={navStyle}>
              <Icon type="profile" />
              订单管理
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={`/manage/r/${props.match.params.rid}/desk`} style={navStyle}>
              <Icon type="desktop" />
              桌面管理
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: "center" }} >
          <Suspense fallback={<div>Loading...</div>}>
            <RestaurantInfo logout={logout} />
          </Suspense>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <Switch>
            <Route path='/manage/r/:rid/food' component={FoodManage} />
            <Route path='/manage/r/:rid/order' component={OrderManage} />
            <Route path='/manage/r/:rid/desk' component={DeskManage} />
            <Route path='/manage/r/:rid/addfood' component={AddFood} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
    </div>
  )
})
