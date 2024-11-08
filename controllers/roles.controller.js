var RoleService = require('../services/role.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getRoles = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 100;
    try {
        var Roles = await RoleService.getRoles({is_super: 0}, page, limit)
        // Return the Roles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: Roles, message: "Roles received successfully."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getRole = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var Role = await RoleService.getRole(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: Role, message: "Role received successfully."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.createRole = async function (req, res, next) {
    try {
        console.log(req.body);
        // Calling the Service function with the new object from the Request Body
        var createdRole = await RoleService.createRole(req.body);
        return res.status(200).json({status:200, flag: true,data: createdRole, message: "Role created successfully."})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.updateRole = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({status: 200, flag: false, message: "Id must be present"})
    }
    try {
        var updatedRole = await RoleService.updateRole(req.body);
        return res.status(200).json({status: 200, flag: true, data: updatedRole, message: "Role updated successfully."})
    } catch (e) {
        console.log('e',e)
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.removeRole = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({status: 200, flag: true, message: "Id must be present"})
    }
    try {
        var deleted = await RoleService.deleteRole(id);
        res.status(200).send({status: 200, flag: true,message: "Role deleted successfully."});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}