var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
});

module.exports=mongoose.model('Task', taskSchema);