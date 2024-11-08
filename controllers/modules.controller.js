var ModuleService = require('../services/module.service');
var RoleService = require('../services/role.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getModules = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 100;
    try {
        var Modules = await ModuleService.getModules({}, page, limit)
        // Return the Modules list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: Modules, message: "Successfully Modules received"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getModule = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var Module = await ModuleService.getModule(id)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: Module, message: "Successfully Module received"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getModulePermission = async function (req, res, next) {
    // console.log("Req User ID >>>>>>",req.userId)
    // console.log("Req Role ID >>>>>>",req.roleId)
    // console.log("Req Club ID >>>>>>",req.clubId)

    var userId = req.userId;
    var roleId = req.roleId;

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var slug = req.body.slug;
    try {
        var Module = await ModuleService.getModuleBySlug(slug);
        if(Module._id) {
            var Role = await RoleService.getRole(roleId);
            if(Role._id && Role.permission.length > 0){
                var modData =  Role.permission.filter(function(mode) {
                    return mode.module_id == Module._id;
                });
                return res.status(200).json({status: 200, flag: true, data: modData[0], message: "Successfully Module received"});
            }
        }
        return res.status(200).json({status: 200, flag: false, message: "Module not found"});
        // Return the Users list with the appropriate HTTP password Code and Message.
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: "Module not found"});
    }
}

exports.createModule = async function (req, res, next) {
    // console.log('req body',req.body)
    try {
        // Calling the Service function with the new object from the Request Body
        var createdModule = await ModuleService.createModule(req.body)
        return res.status(200).json({status:200, flag: true,data: createdModule, message: "Successfully Created Module"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: "Module Creation was Unsuccesfull"})
    }
}

exports.updateModule = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({status: 200, flag: false, message: "Id must be present"})
    }

    try {
        var updatedModule = await ModuleService.updateModule(req.body)
        return res.status(200).json({status: 200, flag: true, data: updatedModule, message: "Successfully Updated Module"})
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.removeModule = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({status: 200, flag: true, message: "Id must be present"})
    }
    try {
        var deleted = await ModuleService.deleteModule(id);
        res.status(200).send({status: 200, flag: true,message: "Successfully Deleted... "});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}