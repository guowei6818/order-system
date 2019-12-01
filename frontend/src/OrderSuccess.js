/*
 * @Author: your name
 * @Date: 2019-11-26 14:47:02
 * @LastEditTime: 2019-11-27 21:38:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\OrderSuccess.js
 */
import React from 'react';


export default function(props){
    var success = {
        width: '500px',
        height: '400px',
        border: '1px solid #d1dbe5',
        borderRadius: '5px',
        margin: '100px auto',
        textAlign: 'center',
    }
    return (
        <div style={success}>
            <h2 style={{borderBottom: '1px solid #d1dbe5', height: '80px', lineHeight: '80px'}}>下单成功!</h2>
            <p style={{height: '100px',fontSize: '24px',lineHeight: '100px'}}>总价格：</p>
            <p style={{height: '80px',fontSize: '30px',color: 'red'}}>￥{props.location.state && props.location.state.totalPrice}元</p>
            <p>祝您用餐愉快！</p>
        </div>
    )
}