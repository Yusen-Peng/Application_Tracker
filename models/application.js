const mongoose = require('mongoose')

const path = require('path')

//define the base path
const resumeFileBasePath = 'uploads/resumes'

//define a schema as a JSON object
const applicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company:{
        //company is actually an ID object
        //which means application.company returns an ID
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //it refers to the "Company" model created before
        //the name must match the model's name
        ref: 'Company'
    },
    status:{
        type: String,
        required: true
    },
    appliedDate: {
        type: Date,
        required: true
    },
    resumeFileName:{
        type: String,
        required: true
    }
})


/*
 * define a virtual property which is NOT in MongoDB
 * return the value of the virtual property using get function
 */
applicationSchema.virtual('resumeFilePath').get(function() {
    if(this.resumeFileName != null){
        //if the file exists
        return path.join('/', resumeFileBasePath, this.resumeFileName)
    }
})



//export the schema
module.exports = mongoose.model('Application', applicationSchema)

//export the export base path
module.exports.resumeFileBasePath = resumeFileBasePath