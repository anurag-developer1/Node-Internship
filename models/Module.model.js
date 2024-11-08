var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ModuleSchema = new mongoose.Schema({
    name: String,
    slug: String,
    status: Number,
})

ModuleSchema.plugin(mongoosePaginate)
const Module = mongoose.model('Modules', ModuleSchema)

module.exports = Module;