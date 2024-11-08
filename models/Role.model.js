var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var RoleSchema = new mongoose.Schema({
    name: String,
    is_super: Number,
    is_admin: Number,
    status: Number,
    permission:[],
},{ timestamps: true })

RoleSchema.plugin(mongoosePaginate)
const Role = mongoose.model('Roles', RoleSchema)

module.exports = Role;