const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


// Define Employee Schema
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    required: true
  },
}, {
  timestamps: true
});

// Export the model
EmployeeSchema.plugin(mongoosePaginate)
const Employee = mongoose.model('Employee', EmployeeSchema)

module.exports = Employee;
