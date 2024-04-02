import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../css/home.css'

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
    setEditTask(task);
    setEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    // Implement edit logic here
    setEditModalVisible(false);
    setEditTask(null);
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
              <div className="col-md-4" style={{ color: item.priority === 'high' ? 'red' : item.priority === 'low' ? 'yellow' : 'inherit' }}>
                 {item.priority}
               </div>
              <div className="col-md-4 justify-content">
                <div className="row justify-content-end ">
                  <EditOutlined
                    className="site-form-item-icon"
                    onClick={() => handleEdit(item)}
                  />
                </div>
                </div>
                <div className="col-md-4">
                <DeleteOutlined
                  className="site-form-item-icon"
                  onClick={() => showDeleteModal(item._id)}
                />
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
        visible={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        {editTask && (
          <Form initialValues={editTask}>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Priority" name="priority">
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Completed" name="completed">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default Home;
