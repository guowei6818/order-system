/*
 * @Author: your name
 * @Date: 2019-11-24 16:52:25
 * @LastEditTime: 2019-11-30 14:26:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\OrderManage.js
 */
import React, {useState, Suspense} from 'react';
import io from 'socket.io-client';
import api from './api';

import { produce } from 'immer';
import {Menu, Button, MessageBox, Message, Table} from 'element-react';


var orderItemStyle = {
    boxSizing: 'border-box',
    height: '260px',
    width: '300px',
    padding: '10px 30px',
    margin: '20px',
    position: 'relative',
    transition: '0.4s',
    border: '1px solid #d1dbe5',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)',
}
var showOrder = {
    width: '',
    display: 'flex',
    flexWrap: 'wrap',
}
class OrderTable extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {
                    label: "菜品名称",
                    prop: "name",
                    width: 125
                  },
                  {
                    label: "数量",
                    prop: "amount",
                    width: 80
                  },
                  {
                    label: "单价",
                    prop: "price",
                    width: 85
                  },
                  {
                    label: "合计",
                    prop: "total",
                    width: 88
                  }
            ],
            data: this.props.list,
        }
    }
    render() {
        console.log(this.state.data);
        return (
            <Table
                style={{width: '100%'}}
                columns={this.state.columns}
                maxHeight={200}
                data={this.state.data}
            />
        )
    }
}
class OrderDetail extends React.Component{
    constructor(props){
        super(props)
    }
    render() {
            return <Button style={{fontSize: '17px'}} type="text" onClick={this.onClick.bind(this)}>查看详单</Button>
        }
        foodDetail(){
            var foodDetail = this.props.order.details;
            let list = [];
            for(let key in foodDetail){
                let val = foodDetail[key]
                let total = val.amount * val.food.price;
                list.push({'name': val.food.name, 'amount': val.amount, 'price':val.food.price, "total": total})
            }
            return <div><OrderTable list={list} /></div>
        }
        onClick() {
            MessageBox.msgbox({
            title: '菜品详单',
            message: this.foodDetail(),
            showCancelButton: true
            }).then(action => {
            Message({
                type: 'info',
                message: 'action: ' + action
            });
            })
        }
}
function OrderItem({order, onDelete}){
    var [orderInfo, setOrderInfo] = useState(order)

    function setConfirm(){
        api.put(`/restaurant/1/order/${order.id}/status`,{
            status: 'confirmed'
        }).then(() => {
            setOrderInfo({
                ...orderInfo,
                status: 'confirmed'
            })
        })
    }
    function setComplited(){
        api.put(`/restaurant/1/order/${order.id}/status`,{
            status: 'completed'
        }).then(() => {
            setOrderInfo({
                ...orderInfo,
                status: 'completed'
            })
        })
    }
    function deleteOrder(){
        api.delete(`/restaurant/1/order/${order.id}`).then(() => {
            onDelete(order);
        });
    }
    return (
        <div style={orderItemStyle}>
            <h2 style={{marginTop: '5px'}}>桌号：{order.deskName}</h2>
            <h3>总价格：{order.totalPrice}元<span style={{marginLeft:'20px'}}>人数：{order.customCount}人</span></h3>
            <h3>订单详情：<OrderDetail order={order} /></h3>
            <h3>订单状态：{order.status}</h3>
            <div>
                <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={setConfirm}>确认</Button>
                <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={setComplited}>完成</Button>
                <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}} onClick={deleteOrder}>删除</Button>
                <Button size='small' style={{backgroundColor: '#8492A6', color: '#fff'}}>打印</Button>
            </div>
        </div>
    )
}

export default class OrderManage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            allOrders: [],
            pendingOrders: [],
            confirmedOrders: [],
            completedOrders: [],
        }
    }

    async componentDidMount(){
        var params = this.props.match.params
        this.socket = io.connect('ws://localhost:5000', {
            'path': '/restaurant',
            'query': {
                    restaurant: `restaurant:${params.rid}`
                }
            }
        )
    
        this.socket.on('connection', () => {
            this.socket.emit('join restaurant', 'restaurant:' + params.rid)
        })
    
        this.socket.on('new order', order => {
            this.setState(produce(state => {
                state.orders.unshift(order)
            }))
        })

        var res = await api.get('/restaurant/1/order');
        this.setState(produce(state => {
            state.allOrders = res.data
        }));
        this.setState(produce(state => {
            state.orders = this.state.allOrders
        }));
        this.setState(produce(state => {
            state.pendingOrders = this.state.allOrders.filter(it => it.status === 'pending')
        }));
        this.setState(produce(state => {
            state.confirmedOrders = this.state.allOrders.filter(it => it.status === 'confirmed')
        }));
        this.setState(produce(state => {
            state.completedOrders = this.state.allOrders.filter(it => it.status === 'completed')
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
    onSelect(index) {
        if(index === '1'){
            this.setState(produce(state => {
                state.orders = this.state.allOrders
            }))
        }else if(index === '2'){
            this.setState(produce(state => {
                state.orders = this.state.pendingOrders
            }))
        }else if(index === '3'){
            this.setState(produce(state => {
                state.orders = this.state.confirmedOrders
            }))
        }else if(index === '4'){
            this.setState(produce(state => {
                state.orders = this.state.completedOrders
            }))
        }
    }
    
    render() {
        return (
            <div>
                <div style={{height: '60px'}}>
                    <Menu className="el-menu-demo" mode="horizontal" onSelect={this.onSelect.bind(this)}>
                        <Menu.Item index="1">所有订单</Menu.Item>
                        <Menu.Item index="2">未处理订单</Menu.Item>
                        <Menu.Item index="3">已接订单</Menu.Item>
                        <Menu.Item index="4">历史订单</Menu.Item>
                    </Menu>
                </div>
                <div style={showOrder}>
                    {this.state.orders.map(order => {
                        return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
                    })}
                </div>
            </div>
        )
    }
}