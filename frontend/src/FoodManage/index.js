/*
 * @Author: your name
 * @Date: 2019-11-24 16:52:36
 * @LastEditTime : 2020-02-14 15:44:25
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\FoodManage.js
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import FoodItem from './FoodItem';
import api from '../api';
import './index.css'
import { foodCategory } from '../Common'
import { Menu, Button } from 'antd';

export default withRouter(function(props){
  var [foods, setFoods] = useState({
    listAll: [],
    foodLists: [],
  });
  const { listAll, foodLists } = foods;

  useEffect(() => {
      api.get('/restaurant/1/food').then(res => {
          setFoods({
            listAll: res.data,
            foodLists: res.data,
          })
      })
  }, [])
  
  const addFood = () => {
    props.history.push(`/manage/r/${props.match.params.rid}/addfood`)
  }
  const onDelete = (id) => {
    setFoods({
      ...foods,
      foodLists: foodLists.filter(it => it.id !== id)
    });
  }
  const onSelect = ({key}) => {
    if(key === '1'){
      setFoods({
        ...foods,
        foodLists: listAll,
      })
    }else{
      setFoods({
        ...foods,
        foodLists: listAll.filter(it => it.category === foodCategory[key])
      })
    }
  }
  return (
    <div>
      <Menu mode="horizontal" defaultSelectedKeys={['1']} onClick={onSelect}>
        <Menu.Item key="0"><Button type="primary" onClick={addFood}>添加菜品</Button></Menu.Item>
        <Menu.Item key="1">所有菜品</Menu.Item>
        <Menu.Item key="2">家常</Menu.Item>
        <Menu.Item key="3">荤菜</Menu.Item>
        <Menu.Item key="4">凉菜</Menu.Item>
        <Menu.Item key="5">海鲜</Menu.Item>
        <Menu.Item key="6">汤类</Menu.Item>
        <Menu.Item key="7">主食甜点</Menu.Item>
        <Menu.Item key="8">饮品</Menu.Item>
      </Menu>
      <div className='foods'>
        {
          foodLists.map(food => {
            return (
              <FoodItem
                onDelete={onDelete}
                key={food.id}
                food={food}
              />)
          })
        }
      </div>
    </div>
  )
})