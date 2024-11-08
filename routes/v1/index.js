const express = require('express');
const router = express.Router();
var Authorization = require('../../auth/authorization');

var UserController = require('../../controllers/users.controller');
var RoleController = require('../../controllers/roles.controller');
var ModulesController = require('../../controllers/modules.controller');
var SettingController = require('../../controllers/setting.controller');
const EmployeeController=require("../../controllers/employees.controller")

//User
router.post('/users/check-email', UserController.checkIsEmailUnique) 
router.post('/users/login', UserController.loginUser)
router.post('/users/register', UserController.registerUser)
router.post('/users/reset-pswd', UserController.getReset) 

router.get('/users/reset-token/:token', UserController.getUserbyToken)
router.post('/users/change-password', UserController.changePassword)

router.post('/users', Authorization, UserController.createUser)
router.get('/users', Authorization, UserController.getUsers)
router.get('/users/:id', Authorization, UserController.getUser)
router.put('/users', Authorization, UserController.updateUser)
router.delete('/users/:id', Authorization, UserController.removeUser)

//role 
router.post('/roles', Authorization,  RoleController.createRole)
router.get('/roles', Authorization, RoleController.getRoles)
router.put('/roles', Authorization, RoleController.updateRole)
router.get('/roles/:id', Authorization, RoleController.getRole)
router.delete('/roles/:id', Authorization, RoleController.removeRole)

//module
router.post('/modules/permission', Authorization, ModulesController.getModulePermission)
router.post('/modules', Authorization,  ModulesController.createModule)
router.get('/modules', Authorization, ModulesController.getModules)
router.put('/modules', Authorization, ModulesController.updateModule)
router.get('/modules/:id', Authorization, ModulesController.getModule)
router.delete('/modules/:id', Authorization, ModulesController.removeModule)

//setting 
router.get('/front-settings', SettingController.getFrontTax)
router.post('/settings', Authorization,  SettingController.createSetting)
router.get('/settings', Authorization, SettingController.getSettings)
router.put('/settings', Authorization, SettingController.updateSetting)
router.put('/settings-alias', Authorization, SettingController.updateSettingAlias)
router.get('/settings/:id', Authorization, SettingController.getSetting)
router.delete('/settings/:id', Authorization, SettingController.removeSetting)


// employee 
router.post('/createEmployee',EmployeeController.createEmployee )
router.get('/getEmployees',EmployeeController.getEmployee)
router.get('/getEmployees/:id', EmployeeController.getEmployeebyID)
router.patch('/editEmployee', EmployeeController.editEmployee)
router.delete('/deleteEmployee',EmployeeController.deleteEmployee)
module.exports = router;