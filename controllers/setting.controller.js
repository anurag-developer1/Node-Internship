var SettingService = require('../services/setting.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getSettings = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 100;
    try {
        var settings = await SettingService.getSettings({}, page, limit)
        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: settings, message: "Settings received successfully."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getFrontTax = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 100;
    try {
        var settings = await SettingService.getSettings({slug: "tax"}, page, limit)
        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: settings, message: "Settings received successfully."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getSetting = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var setting = await SettingService.getSetting(id);
        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: true, data: setting, message: "Setting received successfully."});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.createSetting = async function (req, res, next) {
    try {
        // console.log(req.body);
        // Calling the Service function with the new object from the Request Body
        var createdSetting = await SettingService.createSetting(req.body);
        return res.status(200).json({status:200, flag: true, data: createdSetting, message: "Setting created successfully."})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.updateSettingAlias = async function (req, res, next) {
    // Id is necessary for the update
    try {
        // console.log("updateSetting ",req.body)
        for (var i = 0; i < req.body.length; i++) {
            for (let value of Object.keys(req.body[i])) {
                var keys = value;
                var data = {slug: keys, value: req.body[i][keys]}
                var updatedSetting = await SettingService.updateSettingAlias(data);
            }
        }

        return res.status(200).json({status: 200, flag: true, data: updatedSetting, message: "Setting updated successfully."})
    } catch (e) {
        console.log('e',e)
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.updateSetting = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({status: 200, flag: false, message: "Id must be present"})
    }
    try {
        var updatedSetting = await SettingService.updateSetting(req.body);
        return res.status(200).json({status: 200, flag: true, data: updatedSetting, message: "Setting updated successfully."})
    } catch (e) {
        console.log('e',e)
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}

exports.removeSetting = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({status: 200, flag: true, message: "Id must be present"})
    }
    try {
        var deleted = await SettingService.deleteSetting(id);
        res.status(200).send({status: 200, flag: true, message: "Setting deleted successfully."});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}