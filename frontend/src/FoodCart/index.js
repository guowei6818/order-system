/*
 * @Author: your name
 * @Date: 2019-11-24 16:42:24
 * @LastEditTime : 2020-02-14 16:06:28
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\FoodCart.js
 */
import React, {useState, Suspense} from 'react';
import baseURL from '../baseURL';
import api from '../api';
// import PropTypes from 'prop-types';
import { produce } from 'immer';
import history from '../history';
import io from 'socket.io-client';
import createFetcher from '../create-fetcher';
import {Menu, Button} from 'element-react';
import './index.css';
import { foodCategory } from '../Common';


function MenuItem({food, onUpdata, amount}){
  function dec(){
    if(amount === 0){
      return 
    }
    onUpdata(food, amount - 1);
  }
  function inc(){
    onUpdata(food, amount + 1);
  }
  return (
    <div className='menu-item'>
      <h3 style={{textAlign: 'center'}}>{food.name}</h3>
      <div>
        <img src={baseURL + food.img} alt={food.name} />
        <p className="desc">描述：{food.desc}</p>
        <p>价格：<span className='price'>{food.price}元</span></p>
      </div>
      <div className="count-style">
        <button className='count-button' onClick={dec}>-</button>
        <span>{amount}</span>
        <button className='count-button' onClick={inc}>+</button>
      </div>
    </div>
  )
}

// MenuItem.PropTypes = {
//   food: PropTypes.object.isRequired,
//   onUpdata: PropTypes.func,
// }
// MenuItem.defaultProps = {
//   onUpdata: () => {},
// }

function caclTotalPrice(cartAry){
  return cartAry.reduce((total, item) => {
    return total + item.amount * item.food.price
  }, 0)
}

function CartStatus(props){
  let [expend, setExpend] = useState(false);
  let totalPrice = caclTotalPrice(props.foods)
  return (
    <div className='cart-confirm'>
      {expend ? 
        <Button className='expend' icon="arrow-down" onClick={() => setExpend(false)}></Button> : 
        <Button className='expend' icon="arrow-up" onClick={() => setExpend(true)}></Button>
      }
      <strong>总价：￥<span className='total-price'>{totalPrice}</span>元</strong>
      <Button className='confirm-button' onClick={() => props.onPlaceOrder()}>下单</Button>
    </div>
  )
}

var fetcher = createFetcher((did) => {
  return api.get('/deskinfo?did=' + did)
})
function DeskInfo({did}){
  var info = fetcher.read(did)

  return (
    <div>
      <h2>欢迎光临：<span>{info.data.title}</span></h2>
      <strong>当前桌号：<span>{info.data.name}</span></strong>
    </div>
  )
}
export default class FoodCart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      cart: [],
      deskInfo: null,
      foodMenu: [],
      foodMenuAll: [],
    }
  }

  async componentDidMount(){
    var params = this.props.match.params
    
    api.get('/deskinfo?did=' + params.did).then(val => {
      this.setState({
          deskInfo: val.data
      })
    })

    await api.get('/menu/restaurant/' + params.rid).then(val => {
      this.setState({
        foodMenu: val.data,
        foodMenuAll: val.data,
      })
    })

    // this.socket = io.connect('ws://123.57.174.243:5000', {
    this.socket = io.connect('ws://localhost:5000', {
      'path': '/desk',
      'query': {
        desk: `desk:${params.did}`
      }
    })
  
    this.socket.on('connect', () => {
      // console.log('connect on')
      this.socket.emit('join desk', 'desk:' + params.did)
    })

    // 后端发回此桌面已点菜单
    this.socket.on('cart food', info => {
      this.setState(produce(state => {
        state.cart.push(...info)
      }))
    })
  
      // 来自同桌其它用户新增的菜单
    this.socket.on('new food', info => {
      // console.log(info)
      this.foodChange(info.food, info.amount)
    })
    //当其中一个用户下单后，所有用户跳转至下单成功页面
    this.socket.on('placeorder success', order => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: order,
      })
    })
  }
  componentWillUnmount() {
    this.socket.close()
  }
  
  cartChange = (food, amount) => {
    var params = this.props.match.params
    this.socket.emit('new food', {desk: 'desk:' + params.did, food, amount})
  }

  foodChange = (food, amount) => {
    var updated = produce(this.state.cart, cart => {
      var idx = cart.findIndex(it => it.food.id === food.id)
      if(idx >= 0){
        if(amount === 0){
            cart.splice(idx, 1)
        }else{
            cart[idx].amount = amount
        }
      }else{
        cart.push({
          food,
          amount,
        })
      }
    })
    this.setState({cart: updated});
  }
  placeOrder = () => {
    var params = this.props.match.params

    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
      deskName: this.state.deskInfo.name,
      customCount: params.count,
      totalPrice: caclTotalPrice(this.state.cart),
      foods: this.state.cart,
    }).then(res => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: res.data
      })
    })
  }
  onSelect(index) {
    if(index === '1'){
      this.setState({
        foodMenu: this.state.foodMenuAll
      })
    }else{
      this.setState({
        foodMenu: this.state.foodMenuAll.filter(it => it.category === foodCategory[index])
      })
    }
  }

  render(){
    return (
      <div className='food-cart'>
        <header className='header-style'>
          <Suspense fallback={<div>Loading...</div>}>
            <DeskInfo did={this.props.match.params.did} />
          </Suspense>
        </header>
        <section>
          <aside>
            <Menu className="el-menu-vertical-demo" style={{backgroundColor:'#E5E9F2', width: '180px', textAlign: 'center'}} onSelect={this.onSelect.bind(this)}>
              <Menu.Item index="1">所有菜品</Menu.Item>
              <Menu.Item index="2">家常</Menu.Item>
              <Menu.Item index="3">荤菜</Menu.Item>
              <Menu.Item index="4">凉菜</Menu.Item>
              <Menu.Item index="5">海鲜</Menu.Item>
              <Menu.Item index="6">汤类</Menu.Item>
              <Menu.Item index="7">主食甜点</Menu.Item>
              <Menu.Item index="8">饮品</Menu.Item>
            </Menu>
          </aside>
          <main>
            <div className='show-foods'>
              {
                this.state.foodMenu.map(food => {
                  var currentAmount = 0
                  var currFoodCartItem = this.state.cart.find(cartItem => cartItem.food.id === food.id)
                  if (currFoodCartItem) {
                    currentAmount = currFoodCartItem.amount
                  }
                  return <MenuItem key={food.id} food={food} amount={currentAmount} onUpdata={this.cartChange} />
                })
              }
            </div>
            <CartStatus foods={this.state.cart} onUpdata={this.cartChange} onPlaceOrder={this.placeOrder} /> 
          </main>
        </section>
      </div>
    )
  }

}