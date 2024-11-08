var Setting = require('../models/Setting.model');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Role List
exports.getSettings = async function (query={}, page, limit) {
    var skips = limit * (page - 1)

    // Try Catch the awaited promise to handle the error 
    try {
        var settings = await Setting.find(query)
            .skip(skips)
            .limit(limit);

        return settings;

    } catch (e) {
        throw Error('Error occurred while finding Settings');
    }
}

exports.getSetting = async function (id) {
    try {
        // Find the Data 
        var _details = await Setting.findOne({
            _id: id
        });
        if(_details._id) {
            return _details;
        } else {
            throw Error("Setting not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Setting not available");
    }
}

exports.createSetting = async function (setting) {
// console.log("createSetting ",setting)
    var newSetting = new Setting({
        name: setting.name ? setting.name : "",
        slug: setting.slug ? setting.slug : "",
        value: setting.value ? setting.value : "",
    })

    try {
        // Saving the Role 
        var savedSetting = await newSetting.save();
        return savedSetting;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error occurred while creating Setting")
    }
}

exports.updateSettingAlias = async function(setting) {
    var key = setting.slug;
    try {
        //Find the old Setting Object by the Id
        var oldSetting = await Setting.findOne({slug: key});
    } catch (e) {
        throw Error("Setting not found")
    }

    if(setting.value) {
        oldSetting.value = setting.value;
    }

    try {
        var savedSetting = await oldSetting.save()
        return savedSetting;
    } catch (e) {
        console.log(e)
        throw Error("Error occurred while updating the Setting");
    }
}

exports.updateSetting = async function (setting) {
    var id = setting._id
    try {
        //Find the old Setting Object by the Id
        var oldSetting = await Setting.findById(id);
    } catch (e) {
        throw Error("Setting not found")
    }
    // If no old Setting Object exists return false
    if (!oldSetting) {
        return false;
    }

    //Edit the Setting Object
    if(setting.name) {
        oldSetting.name = setting.name;
    }

    if(setting.slug) {
        oldSetting.slug = setting.slug;
    }

    if(setting.value) {
        oldSetting.value = setting.value;
    }

    try {
        var savedSetting = await oldSetting.save()
        return savedSetting;
    } catch (e) {
        console.log(e)
        throw Error("Error occurred while updating the Setting");
    }
}

exports.deleteSetting = async function (id) {
    // Delete the Setting
    try {
        var deleted = await Setting.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Setting Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error occurred while Deleting the Setting")
    }
}