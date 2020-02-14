/*
 * @Author: your name
 * @Date: 2019-11-26 14:47:02
 * @LastEditTime : 2020-02-13 15:19:07
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\OrderSuccess.js
 */
import React from 'react';
import {Result, Button} from 'antd';

export default function(props){
  return (
    <Result
      status="success"
      title="恭喜下单成功!"
      subTitle={
        <p style={{height: '100px',fontSize: '24px',lineHeight: '100px'}}>
          总价格：<span style={{color: 'red'}}>￥{props.location.state && props.location.state.totalPrice}元</span>
        </p>
      }
      extra={[
        <Button type="primary" key="console">
          查看详单
        </Button>,
        <Button key="buy">继续点餐</Button>,
      ]}
    />
  )
}