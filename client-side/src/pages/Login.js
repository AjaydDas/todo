import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, Navigate } from "react-router-dom";
import '../css/login.css'
const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/login", values);

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setLoggedIn(true);
      } else {
        console.error('Login failed:', response.statusText);
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed');
    }
  };

  if (loggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (

    <div className="row flex-container">
      <div className="col-md-6 flex-items">
        <img src="/background.jpg" alt="Background" className="background-image" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>

      <div className="col-md-6 flex-items d-flex justify-content-center align-items-center">
        <Card className="login-card">
          <h2 className="login-heading">Log in</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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
                Log in
              </Button>
            </Form.Item>
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </Form>
          <Link to="/register">Create New Account</Link>
        </Card>
      </div>
    </div>
  
  );
}

export default Login;
