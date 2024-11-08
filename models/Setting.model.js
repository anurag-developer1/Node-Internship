var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var SettingSchema = new mongoose.Schema({
    name: String,
    slug: String,
    value: String,
},{ timestamps: true })

SettingSchema.plugin(mongoosePaginate)
const Setting = mongoose.model('Settings', SettingSchema)

module.exports = Setting;