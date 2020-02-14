/*
 * @Author: your name
 * @Date: 2019-11-24 17:06:05
 * @LastEditTime : 2020-01-12 18:11:16
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\HomePage.js
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'element-react';
import bgi from '../img/bgi.jpeg';

var homePage={
  width: '500px', 
  height: '300px',
  border: '1px solid #d1dbe5',
  borderRadius: '8px',
  margin: '70px auto',
  textAlign: 'center',
  overflow: 'hidden',
}
var backgroundStyle = {
  width: '100%',
  height: '410px',
  padding: '100px 0',
  backgroundImage: 'url(' + bgi + ')',
  backgroundSize: '100% 100%',
}
var headerStyle = {
  width: '100%',
  height: '60px',
  backgroundColor: '#1D8CE0',
  color: '#fff',
  textAlign: 'center',
  lineHeight: '60px',
  marginBottom: '20px',
}
var buttonStyle = {
  width: '100px',
  height: '80px',
  margin: '20px',
}
export default function(){
  return (
    <div style={backgroundStyle}>
      <div style={homePage}>
        <div style={headerStyle}>
          欢迎使用小猫咪点餐系统
        </div>
        <div style={{height: '220px', marginTop: '40px'}}>
          <Link to="/login"><Button type="primary" style={buttonStyle}>登录</Button></Link>
          <Link to="/register"><Button type="primary" style={buttonStyle}>注册</Button></Link>
        </div>
      </div>
    </div>
  )
}