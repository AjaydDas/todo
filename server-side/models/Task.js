const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    deadline: Date,
    completed: { type: Boolean, default: false },
    photo: {
        type: String, 
        default: null  
      }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
