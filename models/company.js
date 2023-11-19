const mongoose = require('mongoose')

//define a schema as a JSON object
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//export the schema
module.exports = mongoose.model('Company', companySchema)