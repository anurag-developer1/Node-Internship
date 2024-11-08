const Employee = require('../models/Employee.model');
const ImageService = require('../services/image.service');

exports.createEmployee = async(userData) => {

    console.log(userData)
    try {
        // 1. Handle image first
        let imagePath = null;
        if (userData.image) {
            imagePath = await ImageService.saveImage(
                userData.image,    // base64 or URL
                '/images/users'  // save path
            );
        }
      
        // 2. Create employee with processed image path
        const employeeData = {
            ...userData,
            image: imagePath  // Replace base64 with path
        };
        console.log(employeeData)

        const newEmployee = new Employee(employeeData);
        const response = await newEmployee.save();
        console.log(response)
        if (!response) {
            throw new Error("Failed employee registration");
        }
        
        return response;
    } catch (error) {
        throw error;  // Propagate error to controller
    }
};


exports.getEmployee=async(userdata)=>{

    try {
        const page = parseInt(userdata.page) || 1;
        const limit = parseInt(userdata.limit) || 10;
    
        const options = {
          page,
          limit,
          lean: true, // Return plain JavaScript objects instead of Mongoose documents
          sort: { createdAt: -1 }, // Sort by createdAt in descending order
        };
    
        const result = await Employee.paginate({}, options);
        if(!result){
            throw new Error("Failed to fetch employees")
        }
        return result
      } catch (error) {
        throw error;
      }
    
}


exports.getEmployeebyID=async(data)=>{

    try {
        // Get the employee ID from the request parameters
        const employeeId = data.id;
    
        console.log(employeeId)
    
        // Find the employee by their ID
        const employee = await Employee.findById(employeeId);
    
        // If the employee is not found, return a 404 error
        if (!employee) {
          throw new Error("Employee not found")
        }
    
        // Return the employee data
        return employee;
      } catch (error) {
        // Handle any errors that occur
        throw error
      }



}



exports.editEmployee=async(data)=>{

    try {
        // Get the employee ID from the request query parameters
        const employeeId = data.query.id;
         console.log(data.body)
        // Get the updated employee data from the request body
        const { name, email, phone, gender, country,image } = data.body;
        let imagePath = null;
        if (image!=='null') {
            imagePath = await ImageService.saveImage(
                image,    // base64 or URL
                '/images/users'  // save path
            );
            // Find the employee by ID and update the record
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, email, phone, gender, country,image:imagePath },
            {new:true}
          );
          console.log(updatedEmployee)
        // If the employee is not found, return a 404 error
        if (!updatedEmployee) {
          throw new Error("Employee not found")
        }
    
        // Return the updated employee data
        return updatedEmployee
        }
        else{
             // Find the employee by ID and update the record
             
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, email, phone, gender, country },
            {new:true}
          );
          console.log(updatedEmployee)
        // If the employee is not found, return a 404 error
        if (!updatedEmployee) {
          throw new Error("Employee not found")
        }
     
        // Return the updated employee data
        return updatedEmployee

        }
      } catch (error) {
        // Handle any errors that occur
        
        throw error
      }



}



exports.deleteEmployee = async (data) => {
    try {
        // Validate input data
        if (!data || !data.employeeId) {
            throw new Error('Employee ID is required');
        }

        // Check if employee exists before deletion
        const existingEmployee = await Employee.findById(data.employeeId);
        if (!existingEmployee) {
            throw new Error('Employee not found');
        }

        // Perform the deletion
        const deletedEmployee = await Employee.findByIdAndDelete(data.employeeId);

        // Return success response
        return {
            success: true,
            message: 'Employee deleted successfully',
            data: deletedEmployee
        };

    } catch (error) {
        // Handle specific errors
        if (error.name === 'CastError') {
            throw new Error('Invalid employee ID format');
        }

        // Return error response
        throw new Error(error.message || 'Error deleting employee');
    }
};