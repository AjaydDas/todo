import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Card, Modal, Form, Input, Radio, Button, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs'

import '../css/home.css'
import Footer from '../components/Footer';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get("http://localhost:5000/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleEdit = (task) => {

    const formattedDeadline = dayjs(task.deadline).format('YYYY-MM-DD');

    setEditTask({ ...task, deadline: formattedDeadline });
    setEditModalVisible(true);
    console.log(task.deadline)
    setEditTask(task);
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.post(`http://localhost:5000/edit-task`, {
        task_id: editTask._id,
        priority: editTask.priority,
        name: editTask.name,
        description: editTask.description,
        deadline: editTask.deadline,
        documents: editTask.documents,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const updatedTasks = data.tasks.map((task) => {
        if (task._id === editTask._id) {
          return response.data; 
        }
        return task;
      });

      setData({ tasks: updatedTasks });
      setEditModalVisible(false);
      setEditTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditTask(null);
  };

  const showDeleteModal = (taskId) => {
    setDeleteModalVisible(true);
    setDeleteTaskId(taskId);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.post(`http://localhost:5000/delete-task`, {
        task_id: deleteTaskId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const newData = data.tasks.filter((task) => task._id !== deleteTaskId);
      setData({ tasks: newData });

      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {data && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', margin: '50px' }}>
          {data.tasks.map((item) => (
            <Card className="card" key={item._id} style={{ width: 300 , backgroundColor: item.priority === 'high' ? '#E67E7F' : item.priority === 'medium' ? '#F3D780' : item.priority === 'low' ? '#99B880' : 'inherit' }}>
          
              <div className="row flex-container">
              <div className="col-md-3" >
                 {item.priority}
               </div>
              <div className="col-md-5 justify-content">
                  {new Date(item.deadline).toLocaleDateString('en-GB')}
                </div>
                <div className="col-md-4">
                  <div className='row justify-content-center'>
                      <div className="col-md-6">
                        <EditOutlined
                          className="site-form-item-icon"
                          onClick={() => handleEdit(item)}
                        />
                      </div>
                      <div className="col-md-6">
                          <DeleteOutlined
                            className="site-form-item-icon"
                            onClick={() => showDeleteModal(item._id)}
                          />
                      </div>
                  </div>

                  </div>

              </div>
             
              <h1>{item.name}</h1>
              <h3>Priority: {item.priority}</h3>
              <p>Description: {item.description}</p>
              <p>Completed: {item.completed ? 'Yes' : 'No'}</p>
              {/* {item.photo && <img src={item.photo} alt="Task Photo" />} */}
            </Card>
          ))}
        </div>
      )}
      {error && <div>Error: {error}</div>}

      <Modal
        title="Edit Task"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        {editTask && (
          <Form initialValues={editTask}>
            <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Please select a priority' }]}>
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
              <DatePicker/>
            </Form.Item>
            <Form.Item label="Documents" name="documents">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          
          </Form>
        )}
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
      <Footer/>
    </div>

  );
};

export default Home;
