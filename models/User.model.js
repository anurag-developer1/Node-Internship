var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    country_code: Object,
    mobile: String,
    password: String,
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' },
    photo: String,
    life_coins: Number,
    total_life_coins: Number,
    block_life_coins: Array,
    reset_token: String,
    status: Number
},{ timestamps: true })

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('Users', UserSchema)

module.exports = User;