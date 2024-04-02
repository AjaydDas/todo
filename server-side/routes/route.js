var express = require('express');
var router = express.Router();
var taskController = require('../controllers/taskController');
var authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');



router.post("/register",authController.register);
router.post("/login",authController.login);

router.use(verifyToken);
router.get("/", taskController.getAllTasks);

router.get("/tasks", taskController.getAllTasksbyname);


router.get("/task-details", taskController.taskDetails);

router.post('/addtask', taskController.addTask);

router.post('/edit-task', taskController.editTask);

router.post('/to-completetask', taskController.completeTask);

router.post('/delete-task', taskController.deleteTask);


module.exports = router;
