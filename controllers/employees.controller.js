const EmployeeService = require('../services/employee.service')
const Employee = require('../models/Employee.model');

//Async write operation on database
exports.createEmployee = async (req, res) => {
  
  console.log("createEmployee >>>> ",req.body)
  
  //const {name,email,phone,gender,country,image} = req.body;

  try{
    const response = await  EmployeeService.createEmployee(req.body);
    res.status(201).json({success:true,message:"created successfully", employee:response})
  }
  catch(error){
    res.status(500).json({success:false,message:error.message});
  }
};

//Async read operation on database
exports.getEmployee=async (req,res)=>{
  try {
    const response= await EmployeeService.getEmployee(req.query)
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }

}







exports.getEmployeebyID = async (req, res) => {
  try {
  
    const response= await EmployeeService.getEmployeebyID(req.params)

    res.status(200).json(response)

    
  } catch (error) {
    // Handle any errors that occur
    
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.editEmployee = async (req, res) => {
  try {
    
    const response=await EmployeeService.editEmployee(req)
     
    if (!response) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Return the updated employee data
    return res.status(200).json(response);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteEmployee=async(req,res)=>{

  try {
    const result = await EmployeeService.deleteEmployee({ employeeId: req.query.id });
    res.status(200).json(result);
} catch (error) {
    res.status(400).json({ success: false, message: error.message });
}








}