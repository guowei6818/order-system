/*
 * @Author: your name
 * @Date: 2019-11-25 16:22:19
 * @LastEditTime : 2020-02-12 20:57:17
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\AddFood.js
 */
import React from 'react';
import api from '../api';
import { Form, Input, Select, Button, message } from 'antd';
const { Item } = Form;
const { Option } = Select;

class FormItem extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      form: {
        img: null,
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if(err) return;
      const result = {
        ...values,
        img: this.state.form.img,
      }
      let fd = new FormData();
      for(let key in result){
        let val = result[key];
        fd.append(key, val);
      }
      
      const res = await api.post(`/restaurant/${this.props.match.params.rid}/food`, fd);
      if(res.status === 200){
        message.success('添加成功!');
        this.props.history.push(`/manage/r/${this.props.match.params.rid}/food`);
      }else{
        message.warning('添加失败!');
        this.props.history.push(`/manage/r/${this.props.match.params.rid}/food`);
      }
    })
  }

  imgChange = (e) => {
    this.state.form.img = e.target.files[0];
  }
      
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <div style={{width: '600px', padding: '28px 40px'}}>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Item label="名称">
            { getFieldDecorator('name', {
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
              initialvalue: 'on',
            })(
              <Select placeholder="请选择菜品状态">
                <Option value="on">上架</Option>
                <Option value="off">下架</Option>
              </Select>
            )}
          </Item>
          <Item label="描述">
            { getFieldDecorator('desc', {
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
          <Item wrapperCol={{ span: 12, offset: 3 }}>
            <Button type="primary" htmlType='submit'>确认添加</Button>
          </Item>
        </Form>
      </div>
    )
  }
}

const AddFood = Form.create()(FormItem);
export default AddFood;