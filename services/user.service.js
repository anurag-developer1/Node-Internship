// Getting  the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var Role = require('../models/Role.model');
var bcrypt = require('bcryptjs');
var ImageService = require('./image.service');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {
    // Options setup for the mongoose paginate
    var skips = limit * (page - 1)
    // Try Catch the awaited promise to handle the error 
    try {      
        var Users = await User.find(query)
           // .select({name:1,email:1})
            .populate({path: 'role_id', model: Role, select : { '_id': 1,'name':1}})
            .skip(skips)
            .limit(limit);
        // Return the Userd list that was retured by the mongoose promise
        return Users;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Users');
    }
}

exports.getUser = async function (id) {
    try {
        // Find the User 
        var _details = await User.findOne({
            _id: id
        })
        .populate({path: 'role_id',model: Role,select : { '_id': 1,'name':1,'is_admin':1,'is_super':1, 'permission':1}})
        
        if(_details._id) {
            return _details;
        } else {
            throw Error("User not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("User not available");
    }

}

exports.getUserByEmail = async function(email) {
    try {
        // Find the User 
        var _details = await User.findOne({
            email: email
        });
        return _details;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("User not available");
    }
}

exports.getUserByToken = async function(token) {
    try {
        // Find the User 
        var _details = await User.findOne({
            reset_token: token
        });
        return _details;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("User not available");
    }
}

exports.createUser = async function (user) {
    if(user.photo){        
        var isImage = await ImageService.saveImage(user.photo,"/images/users/").then( data => {
            return data;
        });

        if (typeof(isImage) != 'undefined' && isImage != null && isImage != "")
        {
            user.photo = isImage;
        }
    }
   // console.log(user);
    
    var newUser = new User({
        name: user.name,
        email: user.email ? user.email : "",
        country_code: user.country_code ? user.country_code : "",
        mobile: user.mobile ? user.mobile : "",
        password: user.password ? bcrypt.hashSync(user.password, 8) : "",
        role_id: user.role_id ? user.role_id : "60e6e5fb13435a1cdc437b7a", //user role id
        photo: user.photo ? user.photo : "images/users/default_profile_img.png",
        life_coins: user.life_coins ? user.life_coins : 0, 
        total_life_coins: user.total_life_coins ? user.total_life_coins : 0,
        block_life_coins: user.block_life_coins ? user.block_life_coins : [],
        reset_token: user.reset_token ? user.reset_token : "",
        status: user.status ? user.status : 1
    })
   // console.log(newUser);

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        return savedUser;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Creating User")
    }
}

exports.updateUser = async function (user) {
    // console.log("updateUser ",user)
    var id = user._id
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findById(id);
    } catch (e) {
        throw Error("Error occurred while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    
    //Edit the User Object
    oldUser.status = user.status ? user.status: 0;
    oldUser.reset_token = user.reset_token ? user.reset_token: "";

    if(user.name) {
        oldUser.name = user.name;
    }

    if(user.email) {
        oldUser.email = user.email;
    } //email is username so its not updated

    if(user.country_code) {
        oldUser.country_code = user.country_code;
    }

    if(user.mobile) {
        oldUser.mobile = user.mobile;
    }
    
    if(user.role_id) {
        oldUser.role_id = user.role_id;
    }

    if(user.password) {
        oldUser.password = bcrypt.hashSync(user.password, 8);
    }

    if(user.photo) {     
        var isImage = await ImageService.saveImage(user.photo,"/images/users/").then( data => {
            return data;
        });

        if (typeof(isImage) != 'undefined' && isImage != null && isImage != "")
        {
            if(oldUser.photo != 'images/users/default_profile_img.png') {
                var root_path = require('path').resolve('public');
                //console.log("\n User Info >>>>>>",isImage,"\n");
        
                //Remove Previous User Image 
                try {
                    var fs = require('fs');
                    var filePath = root_path +"/"+ oldUser.photo; 
                    //console.log("\n filePath >>>>>>",filePath,"\n");
                    fs.unlinkSync(filePath);
                } catch (e) {
                    //console.log("\n\nImage Remove Issues >>>>>>>>>>>>>>\n\n");
                }
            }
            oldUser.photo = isImage;
        }
    }

    if(user.life_coins && user.action) {
        if(user.action === "plus") {
            oldUser.life_coins = parseInt(oldUser.life_coins) + parseInt(user.life_coins);
            oldUser.total_life_coins = parseInt(oldUser.total_life_coins) + parseInt(user.life_coins);
        } else {
            oldUser.life_coins = parseInt(oldUser.life_coins) - parseInt(user.life_coins);
        }
    }

    if(user.block_life_coins) {
        oldUser.block_life_coins.push(user.block_life_coins);
    }

    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        throw Error("An Error occurred while updating the User");
    }
}

exports.updateBlockLifeCoins = async function (user) {
    var id = user._id
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findById(id);
        // console.log("oldUser ",oldUser)
    } catch (e) {
        throw Error("Error occurred while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }

    if(user.life_coins && user.action) {
        if(user.action === "minus") {
            oldUser.life_coins = parseInt(oldUser.life_coins) + parseInt(user.life_coins);
        } else {
            oldUser.life_coins = parseInt(oldUser.life_coins) - parseInt(user.life_coins);
        }
    }

    if(user.block_life_coins && user.action) {
        var life_coins_id = user.block_life_coins.life_coin_transaction_id;
        var index = oldUser.block_life_coins.findIndex(function(block_life_coins) {
          return block_life_coins.life_coin_transaction_id == life_coins_id
        })

        if(user.action == "plus") {
            var coins = oldUser.block_life_coins[index].coins+user.life_coins
            var blockData = {life_coin_transaction_id: life_coins_id, coins: coins}
            oldUser.block_life_coins.splice(index, 1)
            oldUser.block_life_coins.push(blockData);
        } else {
            var coins = oldUser.block_life_coins[index].coins-user.life_coins;
            var blockData = {life_coin_transaction_id: life_coins_id, coins: coins}
            oldUser.block_life_coins.splice(index, 1)
            oldUser.block_life_coins.push(blockData);
        }
    }

    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch(e) {
        throw Error("An Error occurred while updating the User");
    }
}

exports.removeBlockLifeCoins = async function (user) {
    var id = user._id
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findById(id);
        // console.log("oldUser ",oldUser)
    } catch (e) {
        throw Error("Error occurred while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }

    if(user.life_coins && user.action) {
        if(user.action === "plus") {
            oldUser.life_coins = parseInt(oldUser.life_coins) + parseInt(user.life_coins);
        } else {
            oldUser.life_coins = parseInt(oldUser.life_coins) - parseInt(user.life_coins);
        }
    }

    if(user.block_life_coins && user.action) {
        var index = oldUser.block_life_coins.findIndex(function(block_life_coins) {
          return block_life_coins.life_coin_transaction_id == user.block_life_coins.life_coin_transaction_id
        })
        oldUser.block_life_coins.splice(index, 1)
        oldUser.block_life_coins = oldUser.block_life_coins;
    }

    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch(e) {
        throw Error("An Error occurred while updating the User");
    }
}

exports.deleteUser = async function (id) {
    // Delete the User
    try {
        var deleted = await User.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error occurred while Deleting the User")
    }
}

exports.loginUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        var _details = await User.findOne({
            email: user.email,
            status: 1
        })
        .populate({path: 'role_id',model: Role,select : { '_id': 1,'name':1,'is_admin':1,'is_super':1, 'permission':1}})
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) throw Error("Invalid username/password")
        return _details;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }
}