const Task = require('../models/Task');
const multer = require('multer');
require('dotenv').config();



exports.getAllTasks = (req, res) => {
    Task.find({})
        .then((tasks) => {
            
            tasks.forEach(task => {
                if (task.photo) {
                    baseUrl = process.env.APP_URL;
                    task.photo = baseUrl +task.photo;
                }
            });
            res.json({ tasks: tasks });

        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.addTask = async (req, res) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
    
      const fileFilter = function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG/PNG files are allowed'));
        }
      };
    
      const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
          fileSize: 2 * 1024 * 1024 
        }
      }).single('photo');
    
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: 'Error uploading photo', multerError: err.message });
        } else if (err) {
          return res.status(500).json({ error: err.message });
        }
    
        const { newtask, priority, description, deadline } = req.body;
    
        if (newtask) {
          let photoPath = null;
    
          if (req.file) {
            photoPath = req.file.path;
          }
    
          const task = new Task({
            name: newtask,
            priority,
            description,
            deadline,
            photo: photoPath,
          });
    
          try {
            await task.save();
            res.json({ newTask: newtask });
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
        } else {
          res.status(400).json({ error: 'New task is empty' });
        }
      });
  };

exports.completeTask = (req, res) => {
    var taskId = req.body.task_id;

    Task.findOne({ _id: taskId })
        .then((task) => {
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
            } else {
                task.completed = true;
                return task.save();
            }
        })
        .then((completedTask) => {
            res.json({ message: 'Task completed', completedTask: completedTask });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.deleteTask = (req, res) => {
    var taskId = req.body.task_id;

    Task.findOneAndDelete({ _id: taskId })
        .then((task) => {
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
            } else {
                res.json({ message: 'deleted' });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.getAllTasksbyname = (req, res) => {
    Task.find({})
        .then((tasks) => {
            const ongoingTasks = tasks.filter(task => !task.completed);
            const completedTasks = tasks.filter(task => task.completed);
            res.json({ ongoingTasks, completedTasks });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.taskDetails = (req,res) =>{
    var taskId = req.body.task_id;

    Task.findOne({ _id: taskId })
        .then((task) => {
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
            } else {
               
                res.json(task);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};


exports.editTask = (req,res) =>{
    var taskId = req.body.task_id;
    var updatedTaskName = req.body.updated_task_name;

    Task.findOne({ _id: taskId })
        .then((task) => {
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
            } else {
                task.name = updatedTaskName; 
                return task.save();
            }
        })
        .then((updatedTask) => {
            res.json({ message: 'Task updated', updatedTask });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};
