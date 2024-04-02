import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, Navigate } from "react-router-dom";
import '../css/register.css';

const Register = () => {
  const [registeredIn, setRegisteredIn] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/register", values);

      if (response.status === 200) {
        console.log('Registration successful:', response.data);
        setToken(response.data.token);
        setRegisteredIn(true); 
      } else {
        console.error('Registration failed:', response.statusText);
        setError('Registration failed. Please try again.'); 
      }
    } catch (error) {
      console.error('Error during Registration:', error);
      setError('Registration failed');
    }
  };

  if (registeredIn) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="row flex-container">
    <div className="col-md-6 flex-items">
      <img src="/background.jpg" alt="Background" className="background-image" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
    </div>

    <div className="col-md-6 flex-items d-flex justify-content-center align-items-center">
      <Card className="login-card">
        <h2 className="login-heading">Register Here</h2>
        <Form
        name="normal_register"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your Name!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-email" />} placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input 
            prefix={<MailOutlined className="site-form-item-icon" />} // Use MailOutlined for email icon
            placeholder="Email" 
          />
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
            Register
          </Button>
        </Form.Item>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Form>
      <Link  to="/">Already have an account? Log in</Link>
        </Card>
     
    </div>
    </div>
  );
}

export default Register;