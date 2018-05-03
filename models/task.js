var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    content: String
});

module.exports=mongoose.model('Task', taskSchema);