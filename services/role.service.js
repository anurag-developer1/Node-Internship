var Role = require('../models/Role.model');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Role List
exports.getRoles = async function (query={}, page, limit) {
    var skips = limit * (page - 1)

    // Try Catch the awaited promise to handle the error 
    try {
        var roles = await Role.find(query)
            .skip(skips)
            .limit(limit);

        return roles;

    } catch (e) {
        throw Error('Error occurred while finding Roles');
    }
}

exports.getRole = async function (id) {
    try {
        // Find the Data 
        var _details = await Role.findOne({
            _id: id
        });
        if(_details._id) {
            return _details;
        }else{
            throw Error("Role not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Role not available");
    }

}

exports.createRole = async function (role) {    
    var newRole = new Role({
        name: role.name ? role.name : "",
        is_super: role.is_super ? role.is_super : 0,
        is_admin: role.is_admin ? role.is_admin : 0,
        status: 1,
        permission: role.permission ? role.permission:[]
    })

    try {
        // Saving the Role 
        var savedRole = await newRole.save();
        return savedRole;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error occurred while creating Role")
    }
}

exports.updateRole = async function (role) {
    var id = role._id
    try {
        //Find the old Role Object by the Id
        var oldRole = await Role.findById(id);
    } catch (e) {
        throw Error("Role not found")
    }
    // If no old Role Object exists return false
    if (!oldRole) {
        return false;
    }

    //Edit the Role Object
    if(role.name) {
        oldRole.name = role.name;
    }

    if(role.is_super) {
        oldRole.is_super = role.is_super;
    }

    if(role.is_admin == 1) {
        oldRole.is_admin = 1;
    } else {
        oldRole.is_admin = 0;
    }

    if(role.permission) {
        oldRole.permission = role.permission;
    }
    
    if(role.status) {
        oldRole.status = role.status;
    }

    try {
        var savedRole = await oldRole.save()
        return savedRole;
    } catch (e) {
        console.log(e)
        throw Error("Error occurred while updating the Role");
    }
}

exports.deleteRole = async function (id) {
    // Delete the Role
    try {
        var deleted = await Role.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Role Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error occurred while Deleting the Role")
    }
}