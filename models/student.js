const mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
	name: String,
	password: String,
});

module.exports = Student = mongoose.model("Student", studentSchema);