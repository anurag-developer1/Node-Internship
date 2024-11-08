var Module = require('../models/Module.model');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Module List
exports.getModules = async function (query, page, limit) {
    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        var Modules = await Module.paginate(query, options)
        // Return the module list that was return by the mongoose promise
        return Modules;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Modules');
    }
}

exports.getModuleBySlug = async function (slug) {
    try {
        // Find the Data 
        var _details = await Module.findOne({
            slug: slug
        });
        if(_details._id) {
            return _details;
        } else {
            throw Error("Module not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Module not available");
    }
}

exports.getModule = async function (id) {
    try {
        // Find the Data 
        var _details = await Module.findOne({
            _id: id
        });
        if(_details._id) {
            return _details;
        } else {
            throw Error("Module not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Module not available");
    }
}

exports.createModule = async function (module) {   
    var newModule = new Module({
        name: module.name ? module.name : "",
        slug: module.slug ? module.slug : "",
        status: module.status ? module.status : 1
    })

    try {
        // Saving the Module 
        var savedModule = await newModule.save();
        return savedModule;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Creating Module")
    }
}

exports.updateModule = async function (module) {
    var id = module._id
    try {
        //Find the old Module Object by the Id
        var oldModule = await module.findById(id);
        // console.log('OldModule ',oldModule)
    } catch (e) {
        throw Error("Error occured while Finding the Module")
    }
    // If no old Module Object exists return false
    if (!oldModule) {
        return false;
    }

    //Edit the Module Object
    oldModule.name = module.name

    if(module.title) {
        oldModule.desc = module.desc;
    }
   
    if(module.status) {
        oldModule.status = module.status;
    }

    try {
        var savedModule = await oldModule.save()
        return savedModule;
    } catch (e) {
        throw Error("And Error occured while updating the Module");
    }
}

exports.deleteModule = async function (id) {
    // Delete the Module
    try {
        var deleted = await Module.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Module Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Module")
    }
}