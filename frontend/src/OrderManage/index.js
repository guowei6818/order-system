/*
 * @Author: your name
 * @Date: 2019-11-24 16:52:25
 * @LastEditTime : 2020-02-14 21:25:43
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\OrderManage.js
 */
import React from 'react';
import io from 'socket.io-client';
import api from '../api';
import OrderItem from './OrderItem';
import { produce } from 'immer';
import { Form, Select, Button } from 'antd';
const {Option} = Select
const showOrder = {
  width: '',
  display: 'flex',
  flexWrap: 'wrap',
}

class OrderManage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      orders: [],
      allOrders: [],
    }
  }

  async componentDidMount(){
    var params = this.props.match.params
    // this.socket = io.connect('ws://123.57.174.243:5000', {
    this.socket = io.connect('ws://localhost:5000', {
      'path': '/restaurant',
      'query': {
        restaurant: `restaurant:${params.rid}`
      }
    })

    this.socket.on('connection', () => {
      this.socket.emit('join restaurant', 'restaurant:' + params.rid)
    })

    this.socket.on('new order', order => {
      this.setState(produce(state => {
        state.orders.unshift(order)
      }))
    })

    var res = await api.get(`/restaurant/${params.rid}/order`);
    this.setState(produce(state => {
      state.allOrders = res.data
    }));
    this.setState(produce(state => {
      state.orders = this.state.allOrders
    }));
  }
    
  componentWillUnmount() {
    this.socket.close()
  }
  onDelete = (order) => {
    var idx = this.state.orders.findIndex(it => it.id === order.id);
    this.setState(produce(this.state, state => {
      state.orders.splice(idx, 1);
    }))
  }
  //筛选功能
  onSelect = () => {
    const values = this.props.form.getFieldsValue();
    const { deskName, status } = values;
    const { allOrders } = this.state;
    this.setState({
      ...this.state,
      orders: allOrders.filter((it) => {
        if(deskName === '' && status === '') {
          return it
        };
        if(deskName === ''){
          return it.status === status;
        }else if(status === ''){
          return it.deskName === deskName;
        }else{
          return it.deskName === values.deskName && it.status === values.status;
        }
      })
    }) 
  }
  reset = () => {
    this.props.form.resetFields();
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="inline" style={{marginLeft: '24px'}}>
          <Form.Item label="桌号">
            {getFieldDecorator("deskName", {
              initialValue: '',
            })(
              <Select style={{width: '240px'}}>
                <Option value="A01">A01</Option>
                <Option value="A02">A02</Option>
                <Option value="A04">A04</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("status", {
              initialValue: '',
            })(
              <Select style={{width: '240px'}}>
                <Option value="pending">等待接单</Option>
                <Option value="confirmed">正在备餐</Option>
                <Option value="completed">已完成</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.onSelect}>搜索</Button>
            <Button style={{marginLeft: '10px'}} onClick={this.reset}>重置</Button>
          </Form.Item>
        </Form>
        <div style={showOrder}>
          {this.state.orders.map(order => {
            return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
          })}
        </div>
      </div>
    )
  }
}

export default Form.create()(OrderManage);