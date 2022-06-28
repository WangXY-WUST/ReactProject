import React from 'react'
import './login.css'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()

  // onFinish可以获取表单数据
  const onFinish = (value) => {
    axios.get(`http://localhost:5000/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then((res) => { 
    if (res.data.length === 0) {
        message.error('用户名和密码不匹配')
      }else {
        // 存储token
        localStorage.setItem('token' , JSON.stringify(res.data[0]))
        navigate('/home')
      }
     })
  }
  return (
    <div style={{ background: 'rgb(35 , 39 , 65)', height: '100%' }}>
      <div className='formContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
