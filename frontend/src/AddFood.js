/*
 * @Author: your name
 * @Date: 2019-11-25 16:22:19
 * @LastEditTime: 2019-11-30 09:41:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\AddFood.js
 */
import React from 'react';
import api from './api';

import {Select, Form, Input, Button} from 'element-react';


export default class FormItem extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            form: {
                name: '',
                price: '',
                status: '',
                desc: '',
                category: '',
                img: null,
            }
        };
    }
        
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        });
    }

    confilm = async() => {
        let forms = this.state.form;
        let fd = new FormData();
        for(let key in forms){
            let val = forms[key];
            fd.append(key, val);
        }
        
        var res = await api.post(`/restaurant/${this.props.match.params.rid}/food`, fd);
        if(res.status === 200){
            this.props.history.push(`/manage/r/${this.props.match.params.rid}/food`);
        }else{
            alert('添加失败');
            this.props.history.push(`/manage/r/${this.props.match.params.rid}/food`);
        }
    }

    imgChange = (e) => {
        this.state.form.img = e.target.files[0];
    }
        
    render() {
        return (
            <div style={{width: '600px', padding: '28px 40px'}}>
                <Form labelPosition='left' labelWidth="60" model={this.state.form} className="demo-form-stacked">
                    <Form.Item label="名称：">
                        <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
                    </Form.Item>
                    <Form.Item label="价格：">
                        <Input value={this.state.form.price} onChange={this.onChange.bind(this, 'price')}></Input>
                    </Form.Item>
                    <Form.Item label="状态：">
                        <Select value={this.state.form.status} placeholder="请选择菜品状态" onChange={this.onChange.bind(this, 'status')}>
                            <Select.Option label="上架" value="on"></Select.Option>
                            <Select.Option label="下架" value="off"></Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="描述：">
                        <Input value={this.state.form.desc} onChange={this.onChange.bind(this, 'desc')}></Input>
                    </Form.Item>
                    <Form.Item label="分类：">
                        <Select value={this.state.form.category} placeholder="请选择菜品分类" onChange={this.onChange.bind(this, 'category')} style={{width:'100%'}}>
                            <Select.Option label="家常" value="家常"></Select.Option>
                            <Select.Option label="荤菜" value="荤菜"></Select.Option>
                            <Select.Option label="凉菜" value="凉菜"></Select.Option>
                            <Select.Option label="海鲜" value="海鲜"></Select.Option>
                            <Select.Option label="汤类" value="汤类"></Select.Option>
                            <Select.Option label="主食甜点" value="主食甜点"></Select.Option>
                            <Select.Option label="饮品" value="饮品"></Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="图片：">
                        <input type='file' onChange={this.imgChange} />
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={this.confilm}>确认添加</Button>
            </div>
        )
    }
}