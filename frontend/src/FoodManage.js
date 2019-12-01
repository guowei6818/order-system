/*
 * @Author: your name
 * @Date: 2019-11-24 16:52:36
 * @LastEditTime: 2019-11-30 13:48:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\FoodManage.js
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import api from './api';
import './CSS/foodItem.css'
import baseURL from './baseURL'

import {Menu, Button} from 'element-react';

export default withRouter(function(props){
    var [foods, setFoods] = useState([]);

    useEffect(() => {
        api.get('/restaurant/1/food').then(res => {
            setFoods(res.data)
        })
    }, [])
    
    function FoodItem({food}){
        var [foodProps, setFoodProps] = useState({
            name: food.name,
            desc: food.desc,
            price: food.price,
            category: food.category,
            status: food.status,
            img: null,
        })
        var [foodInfo, setFoodInfo] = useState(food)
        function changeFood(){
            props.history.push({pathname: `/manage/r/${props.match.params.rid}/changefood`, query:{fid: food.id} })
        }
        function deleteFood(){
            api.delete(`/restaurant/${food.rid}/food/${food.id}`).then(() => {
                onDelete(food.id)
            })
        }
        function setOffLine(){
            api.put(`/restaurant/${food.rid}/food/${food.id}`,{
                ...foodProps,
                status: 'off'
            }).then(res => {
                setFoodInfo(res.data)
            })
        }
        function setOnLine(){
            api.put(`/restaurant/${food.rid}/food/${food.id}`,{
                ...foodProps,
                status: 'on'
            }).then(res => {
                setFoodInfo(res.data)
            })
        }

        return (
            <div className='food-item'>
                <img src={baseURL + food.img} className="image" />
                <div className="food-info">
                    <h3>{food.name}</h3>
                    <div>
                        <p>描述：{food.desc}</p>
                        <p>单价：<span className='price'>{food.price} 元</span></p>
                        <p>状态：<span>{food.status === 'on' ? '上架':'已下架'}</span></p>
                    </div>
                </div>
                <div className='food-contral'>
                    <Button size='large' type='primary' onClick={changeFood}>修改</Button>
                    {
                        foodInfo.status === 'off' ? 
                        <Button style={{margin: 0}} size='large' type='primary' onClick={setOnLine}>上架</Button> : 
                        <Button style={{margin: 0}} size='large' type='primary' onClick={setOffLine}>下架</Button>
                    }
                    <Button style={{margin: 0}} size='large' type='primary' onClick={deleteFood}>删除</Button>
                </div>
            </div>
        )
    }
    function addFood(){
        props.history.push(`/manage/r/${props.match.params.rid}/addfood`)
    }
    function onDelete(id){
        setFoods(foods.filter(it => it.id !== id));
    }
    function onSelect(index) {
        if(index === '1'){
           console.log(1)
        }else if(index === '2'){
            console.log(2)
        }else if(index === '3'){
            console.log(3)
        }else if(index === '4'){
            console.log(4)
        }else if(index === '5'){
            console.log(5)
        }else if(index === '6'){
            console.log(6)
        }else if(index === '7'){
            console.log(7)
        }else if(index === '8'){
            console.log(8)
        }
    }
    return (
        <div>
            <Menu className="el-menu-demo" mode="horizontal" onSelect={onSelect.bind(this)}>
                <Menu.Item index="0"><Button type="primary" onClick={addFood}>添加菜品</Button></Menu.Item>
                <Menu.Item index="1">所有菜品</Menu.Item>
                <Menu.Item index="2">家常</Menu.Item>
                <Menu.Item index="3">荤菜</Menu.Item>
                <Menu.Item index="4">凉菜</Menu.Item>
                <Menu.Item index="5">海鲜</Menu.Item>
                <Menu.Item index="6">汤类</Menu.Item>
                <Menu.Item index="7">主食甜点</Menu.Item>
                <Menu.Item index="8">饮品</Menu.Item>
            </Menu>
            <div className='foods'>
                {
                    foods.map(food => {
                        return <FoodItem onDelete={onDelete} key={food.id} food={food} />
                    })
                }
            </div>
        </div>
    )
})