/*
 * @Author: your name
 * @Date: 2019-11-25 13:50:46
 * @LastEditTime : 2020-02-13 12:34:45
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\ChangeFood.js
 */
import React from 'react';
import {Select, Form, Input, Button, message} from 'antd';
const { Item } = Form;
const { Option } = Select;

class FormItem extends React.Component{
  constructor(props) {
    super(props);
  }

  imgChange = (e) => {
    this.props.imgChange(e.target.files[0]);
  }
    
  render() {
    const { getFieldDecorator } = this.props.form;
    const { name, price, status, desc, category } = this.props.foodInfo;

    return (
      <>
        <Item label="名称">
          { getFieldDecorator('name', {
            initialValue: name,
            rules: [{
              required: true,
              message: '请输入菜品名称!'
            }]
          })(
            <Input placeholder='请输入菜品名称'/>
          ) }
        </Item>
        <Item label="价格">
          { getFieldDecorator('price', {
            initialValue: price,
            rules: [{
              required: true,
              message: '请输入价格!'
            }]
          })(
            <Input placeholder='请输入菜品价格'/>
          )}
        </Item>
        <Item label="状态">
          { getFieldDecorator('status', {
            initialValue: status,
          })(
            <Select placeholder="请选择菜品状态">
              <Option value="on">上架</Option>
              <Option value="off">下架</Option>
            </Select>
          )}
        </Item>
        <Item label="描述">
          { getFieldDecorator('desc', {
            initialValue: desc,
            rules: [{
              required: true,
              message: '请输入菜品描述!'
            }]
          })(
            <Input placeholder='请输入菜品描述' />
          )}
        </Item>
        <Item label="分类">
          { getFieldDecorator('category', {
            initialValue: category,
            rules: [{
              required: true,
              message: '请选择菜品分类!'
            }]
          })(
            <Select placeholder="请选择菜品分类">
              <Option value="家常">家常</Option>
              <Option value="荤菜">荤菜</Option>
              <Option value="凉菜">凉菜</Option>
              <Option value="海鲜">海鲜</Option>
              <Option value="汤类">汤类</Option>
              <Option value="主食甜点">主食甜点</Option>
              <Option value="饮品">饮品</Option>
            </Select>
          )}
        </Item>
        <Item label='图片'>
          <input type='file' onChange={this.imgChange}/>
        </Item>
      </>
    )
  }
}
export default FormItem;