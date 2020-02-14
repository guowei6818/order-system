/*
 * @Author: your name
 * @Date: 2019-11-24 16:42:34
 * @LastEditTime : 2020-01-12 18:11:37
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\Login.js
 */
import React from 'react';
import {Button} from 'element-react';
import api from '../api';
import {Input, Form} from 'element-react';
import bgi from '../img/bgi.jpeg';

let bgcStyle ={
    backgroundImage: 'url(' + bgi + ')',
    backgroundSize: '100% 100%',
    padding: '130px 30px 30px 30px'
}
var loginStyle = {
    width: '520px',
    margin: 'auto',
    border: '1px solid #d1dbe5',
    borderRadius: '4px',
}
var loginHeader = {
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
        captcha: ''
      },
      captchaUrl: '',
    };
  }
    
  onChange(key, value) {
    this.setState({
      form: Object.assign(this.state.form, { [key]: value })
    });
  }
  
  componentDidMount(){
    api.get('/captcha').then(res => {
      this.setState({captchaUrl: 'data:image/svg+xml;base64,' + btoa(res.data)});
    })
  }
  login = async () => {
    try{
      var res = await api.post('/login', this.state.form);
      this.props.history.push(`/manage/r/${res.data.id}/food`);
    }catch(e){
      alert(e.response.data.msg);
    }
  }

  render() {
    return (
      <div style={bgcStyle}>
        <div style={loginStyle}>
          <div style={loginHeader}>
            餐厅管理员登录
          </div>
          <div style={{width: '95%', padding: '20px', marginRight: '10px', boxSizing: 'border-box'}}>
            <Form labelPosition={this.state.labelPosition} labelWidth="90" model={this.state.form} className="demo-form-stacked">
              <Form.Item label="用户名：">
                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
              </Form.Item>
              <Form.Item label="密码：">
                <Input type='password' value={this.state.form.password} onChange={this.onChange.bind(this, 'password')}></Input>
              </Form.Item>
              <Form.Item label="验证码：">
                <Input value={this.state.form.captcha} onChange={this.onChange.bind(this, 'captcha')}></Input>
              </Form.Item>
              <img style={{marginLeft: '90px'}} src={this.state.captchaUrl} alt='captcha' />
              <span style={{color: '#ccc'}}>验证码</span>
            </Form>
            <Button style={{width: '60%', margin: '10px 0 0 90px'}} type="primary" onClick={this.login}>登录</Button>
          </div>
        </div>
      </div>
    )
  }
}
