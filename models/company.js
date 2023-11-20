const mongoose = require('mongoose')

//import application model
const Application = require('./application') 

//define a schema as a JSON object
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// //pre: run a certain method before the action (deleteOne) occurs
// companySchema.pre('deleteOne', function(next){
//     //remember in Application model, application.company is an ID object
//     Application.find({company: this.id}, (err, applications) =>{
//         if(err){
//             //if we have trouble finding matching applications
//             next(err)
//         }else if (applications.length > 0){
//             //if any application associated with this company still exists
//             //throw an error and prevent from removing this company
//             next(new Error('This company still has applications')) 
//         } else {
//             //it's okay to continue to remove the company
//             next()
//         }
//     })
// })


//export the schema
module.exports = mongoose.model('Company', companySchema)