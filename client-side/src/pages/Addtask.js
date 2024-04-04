import React, { useState } from 'react';
import { Button, Card, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, TreeSelect } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import  { UploadProps } from 'antd'
import {  message, Upload } from 'antd';
import axios from 'axios';

const Addtask = () => {

  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const formData = new FormData();
        
      formData.append('priority', values.size);
      formData.append('newtask', values.name);
      formData.append('description', values.description);
      formData.append('deadline', values.deadline.format('YYYY-MM-DD'));


      const response = await axios.post('http://localhost:5000/addtask', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response.status === 200) {
        console.log('Task added:', response.data);
        form.resetFields();
        message.success('Task added successfully')
      } else {
        console.error('Task failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during add:', error);
      setError('Add failed');
    }
  };

  return (
    <div className="row flex-container">
      <div className="justify-content-center" style={{ width: '800px' }}>
        <Card>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            initialValues={{ size: 'default' }}
          >
            <Form.Item label="Priority" name="size" rules={[{ required: true, message: 'Please select a priority' }]}>
              <Radio.Group>
                <Radio.Button value="low">Low</Radio.Button>
                <Radio.Button value="medium">Medium</Radio.Button>
                <Radio.Button value="high">High</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea />
            </Form.Item>
            <Form.Item label="Deadline" name="deadline" rules={[{ required: true, message: 'Please enter deadline' }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="Documents" name="documents">
              <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Addtask;













