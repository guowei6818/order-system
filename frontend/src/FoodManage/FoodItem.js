/*
 * @Author: your name
 * @Date: 2020-02-13 10:31:00
 * @LastEditTime : 2020-02-14 19:45:38
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\FoodManage\FoodItem.js
 */
import React, { useState } from 'react';
import ChangeFood from '../ChangeFood';
import api from '../api';
import baseURL from '../baseURL'
import './index.css'

import { Button, Modal, message, Form } from 'antd';

const FoodItem = (props) => {
  const {food, onDelete, form} = props;
  const { rid, id } = food;
  const [foodProps, setFoodProps] = useState({
    modalVisible: false,
    name: food.name,
    desc: food.desc,
    price: food.price,
    category: food.category,
    status: food.status,
    img: food.img,
  })
  const { modalVisible, img } = foodProps;
  const [foodInfo, setFoodInfo] = useState(food)
  const setModalVisible = () => {
    setFoodProps({
      ...foodProps,
      modalVisible: !modalVisible
    })
  }
  const changeFood = () =>{
    setModalVisible()
  }
  const deleteFood = () => {
    api.delete(`/restaurant/${rid}/food/${id}`).then(() => {
      onDelete(food.id)
    })
  }
  const setOffLine = () => {
    api.put(`/restaurant/${rid}/food/${id}`,{
      ...foodProps,
      status: 'off'
    }).then(res => {
      setFoodInfo(res.data)
    })
  }
  const setOnLine = () => {
    api.put(`/restaurant/${rid}/food/${id}`,{
      ...foodProps,
      status: 'on'
    }).then(res => {
      setFoodInfo(res.data)
    })
  }
  const imgChange = (data) => {
    setFoodProps({
      ...foodProps,
      img: data,
    })
  }
  //修改
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if(err) return;
      const result = {
        ...values,
        img: img,
      }
      let fd = new FormData();
      for(let key in result){
        let val = result[key];
        fd.append(key, val);
      }
      api.put(`/restaurant/${rid}/food/${id}`, fd).then(res => {
        setModalVisible()
        setFoodInfo(res.data)
        if(res.status === 200){
          message.success('修改成功!');
        }else{
          message.warning('修改失败!');
        }
      });
    })
  }
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
  };

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
      {
        modalVisible &&
        <Modal
          title="修改"
          width='600px'
          okText="保存"
          cancelText="取消"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={setModalVisible}
        >
          <Form {...formItemLayout}>
            <ChangeFood foodInfo={food} imgChange={imgChange} form={form} />
          </Form>
        </Modal>
      }
    </div>
  )
}
export default Form.create()(FoodItem);