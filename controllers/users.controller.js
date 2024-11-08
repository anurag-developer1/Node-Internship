var UserService = require('../services/user.service');
var RoleService = require('../services/role.service');
var MailService = require('../services/mail.service');
var jwt = require('jsonwebtoken');

_this = this;

exports.getUsers = async function (req, res, next) {
    console.log("Req User ID >>>>>>",req.userId)
    console.log("Req Role ID >>>>>>",req.roleId)

    var match = {}  

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 100;
    
    try {
        var users = await UserService.getUsers(match, page, limit)
        
        for(var i = 0; i < users.length; i++) {
            if(users[i].role_id.name == "Admin") {
                users.splice(i, 1);
            }
        }
        
        return res.status(200).json({status: 200, flag: true, data: users, message: "Users received successfully"});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getUser = async function (req, res, next) {
    var id = req.params.id;
    try {
        var User = await UserService.getUser(id);
        return res.status(200).json({status: 200, flag: true, data: User, message: "User received successfully"});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.checkIsEmailUnique = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var email = req.body.email;
    try {
        var User = await UserService.getUserByEmail(email);
        if(User && User._id) {
            flag = false;
            message = 'Email already exists';
        } else {
            flag = true;
            message = 'Email does not exists';
        }
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, flag: flag, message: message});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getReset = async function (req, res, next) {
    // console.log("getReset ",req.body);
    if (!req.body.email) {
        return res.status(200).json({status: 200, flag: false, message: "email must be present"})
    }
    try {
        var user = await UserService.getUserByEmail(req.body.email);
        var token1 = jwt.sign({
            id: user._id,
        }, process.env.SECRET);

        var to = user.email;
        var name = user.name;
        var subject = "Reset Password";
        var temFile = "reset_password.hjs";
        var data = {_id: user._id, name: name, status: 1, reset_token: token1};
        var updatedUser = await UserService.updateUser(data);
        var createdMail = await MailService.sendEmail(to, name, subject, temFile, data)
        return res.status(200).json({status: 200, flag: true, message: "Password reset link sent, check your email."});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.getUserbyToken = async function (req, res, next) {
    try {
        var user = await UserService.getUserByToken(req.params.token);
        // console.log("user ",user)
        if(user) {
            if(user.reset_token == req.params.token) {
                return res.status(200).json({status: 200, flag: true,  message: "Token Valid."});
            }
        }
        return res.status(200).json({status: 200, flag: false, message: "Token not valid."});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.changePassword = async function (req, res, next) {
    // console.log("changePassword ",req.body);
    if (!req.body.reset_token) {
        return res.status(200).json({status: 200, flag: false, message: "token must be present"})
    }
    try {
        var user = await UserService.getUserByToken(req.body.reset_token);
        if(user) {
            var data = {_id: user._id, password: req.body.password, status: 1, reset_token: ""}
            var updatedUser = await UserService.updateUser(data);
            var to = user.email;
            var name = user.name;
            var subject = "Password changed";
            var temFile = "changed_password.hjs";
            var toMail = {name: name};
            var createdMail = await MailService.sendEmail(to, name, subject, temFile, toMail)
        } else {
            return res.status(200).json({status: 200, flag: false, message: "token expired"});
        }
        
        return res.status(200).json({status: 200, flag: true, message: "Password changed successfully."});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message});
    }
}

exports.createUser = async function (req, res, next) {
    try {
        var email = req.body.email;
        if (!email) {
            return res.status(200).json({status: 200, flag: false, message: "Email must be present"})
        }
        var User = await UserService.getUserByEmail(email);

        if(User && User._id) {
            return res.status(200).json({status: 200, flag: false, message: "Email already present"})
        } else {
            // Create User           
            var createdUser = await UserService.createUser(req.body);
            return res.status(200).json({flag: true, new_user:true , data: createdUser, message: "User created successfully"})
        }
        
    } catch (e) {
        console.log(e)
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200,flag: false, message: "Issue with create user."})
    }  
}

exports.updateUser = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({status: 200, flag: false, message: "Id must be present"})
    }
    try {
        var updatedUser = await UserService.updateUser(req.body)
        updatedUser = await UserService.getUser(req.body._id)
        return res.status(200).json({status: 200, flag: true, data: updatedUser, message: "User updated successfully"})
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: "Issue with update user."})
    }
}

exports.registerUser = async function (req, res, next) {
    try {
        var email = req.body.email;

        if (!email) {
            return res.status(200).json({status: 200, flag: false, message: "Email must be present"})
        }
        var User = await UserService.getUserByEmail(email);

        if(User && User._id) {
            return res.status(200).json({status: 200, flag: false, message: "Email already present"})
        } else {
            // Create User           
            var createdUser = await UserService.createUser(req.body);
            var createdUserData = await UserService.getUser(createdUser._id);

            var token1 = jwt.sign({
                id: createdUserData._id,
                role_id: createdUserData.role_id._id,
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });

            return res.status(200).json({flag: true, new_user:true , data: createdUserData,token: token1, message: "User created successfully"})
        }
    } catch (e) {
        console.log(e)
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200,flag: false, message: "Issue with create user."})
    }
}

exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        email: req.body.email,
        password: req.body.password,
    }    
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);

        var token1 = jwt.sign({
            id: loginUser._id,
            role_id: loginUser.role_id._id,
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        return res.status(200).json({status:200, flag: true, data: loginUser,token: token1, message: "User logged successfully"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({status: 200, flag: false, message: "Invalid username or password"})
    }
}

exports.removeUser = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({status: 200, flag: true, message: "Id must be present"})
    }
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send({status: 200, flag: true,message: "User deleted successfully"});
    } catch (e) {
        return res.status(200).json({status: 200, flag: false, message: e.message})
    }
}