/*
 * @Author: your name
 * @Date: 2019-11-27 22:32:49
 * @LastEditTime: 2019-11-30 15:27:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\Register.js
 */
import React from 'react';
import {Button} from 'element-react';
import api from './api';
import {Input, Form} from 'element-react'
import bgi from './CSS/bgi.jpeg';

let bgcStyle ={
    backgroundImage: 'url(' + bgi + ')',
    backgroundSize: '100% 100%',
    padding: '130px 30px 30px 30px'
}
var registerStyle = {
    width: '520px',
    margin: 'auto',
    border: '1px solid #d1dbe5',
    borderRadius: '4px',
}
var registerHeader = {
    width: '100%',
    height: '60px',
    backgroundColor: '#20A0FF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '60px',
    marginBottom: '20px', 
}

export default class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: '',
                password: '',
                email: '',
                title: '',
            },
        };
    }
      
    onChange(key, value) {
        this.setState({
            form: Object.assign(this.state.form, { [key]: value })
        });
    }
    
    
    rigister = async () => {
        try{
            await api.post('/register', this.state.form)
            this.props.history.push('/');
        }catch(e){
            alert(e.response.data.msg);
        }
    }

    render() {
        return (
            <div style={bgcStyle}>
                <div style={registerStyle}>
                    <div style={registerHeader}>
                        餐厅注册
                    </div>
                    <div style={{width: '95%', padding: '20px', marginRight: '10px', boxSizing: 'border-box'}}>
                        <Form labelPosition={this.state.labelPosition} labelWidth="90" model={this.state.form} className="demo-form-stacked">
                            <Form.Item label="餐厅账号：">
                                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
                            </Form.Item>
                            <Form.Item label="密码：">
                                <Input type='password' value={this.state.form.password} onChange={this.onChange.bind(this, 'password')}></Input>
                            </Form.Item>
                            <Form.Item label="邮箱：">
                                <Input value={this.state.form.email} onChange={this.onChange.bind(this, 'email')}></Input>
                            </Form.Item>
                            <Form.Item label="餐厅名称：">
                                <Input value={this.state.form.title} onChange={this.onChange.bind(this, 'title')}></Input>
                            </Form.Item>
                        </Form>
                        <Button style={{width: '60%', margin: '10px 0 0 90px'}} type="primary" onClick={this.rigister}>注册</Button>
                    </div>
                </div>
            </div>
        )
    }
}