//basic router setup
const express = require('express')
const router = express.Router()

//import the application model
const Application = require('../models/application')

//import the company model 
const Company = require('../models/company')

//import path
const path = require('path')

//import file system library
const fs = require('fs')

//specify the upload path by joining
const uploadPath = path.join('public', Application.resumeFileBasePath)

//import multer
const multer = require('multer')

//acceptable file formats
const resumeMimeTypes = ['image/png']

//configure how to upload files
const upload = multer({
    //the upload destination
    dest: uploadPath,
    //filter which files the server accept
    fileFilter: (req, file, callback) => {
        /*
         * first parameter: error (null)
         * checks if the MIME type of the file is allowed
        */
        callback(null, resumeMimeTypes.includes(file.mimetype))
    }
})


//all applications route
router.get('/', async (req, res) =>{
    try{
        //implement the search options
        let searchOptions = {}
        //Note: get request sends information through a query string
        if(req.query.title != null && req.query.title != ''){
            //configure the JSON if name is valid
            //RegExp: used for matching text with a pattern
            searchOptions.title = new RegExp(req.query.title, 'i') //'i': case-insensitive
        }

        if(req.query.status != null && req.query.status != ''){
            //configure the JSON if company is valid
            //RegExp: used for matching text with a pattern
            searchOptions.status = new RegExp(req.query.status, 'i') //'i': case-insensitive
        }

        const applications = await Application.find(searchOptions)

        res.render('applications/index', {
            applications: applications,
            searchOptions: req.query
        })

    }catch{
        res.redirect('/')
    }
    
})

//new application route -- display the form
router.get('/new', async (req, res) => {
    try{
        //get all companies first
        const companies = await Company.find({})
        //create a new empty application
        const application = new Application()
        //render the form and send back existing companies and an empty application
        res.render('applications/new', {
            companies: companies,
            application: application
        })
    }catch{
        res.redirect('applications')
    }
})

//create application route -- create a new application
router.post('/', upload.single('resume'), async (req, res) => {
    /*
     * upload.single('fileName'): 
     * upload a single file with a specific name
     */

    //get the file's name
    const resumeFileName = req.file != null ? req.file.filename : null 

    //create a new application
    const application = new Application({
        title: req.body.title,
        company: req.body.company,
        status: req.body.status,
        appliedDate: new Date(req.body.appliedDate),
        resumeFileName: resumeFileName
    })
    
    try{
        //save the new application
        const newApplication = await application.save()
        
        //redirect to this new application page  
        //res.redirect(`applications/${newApplication.id}`)
        res.redirect('applications')
    }catch{
        /*
         * if any error occurs, re-render the form
         */ 
        try{
            //remove the resume first if any file is uploaded
            if(application.resumeFileName != null){
                //unlink: remove a file
                fs.unlink(path.join(uploadPath, application.resumeFileName), err => {
                    if(err) console.error(err)
                })
            }

            //get all companies first from the database
            const companies = await Company.find({})
            
            //re-render the form 
            //send back existing companies, application, and error message
            res.render('applications/new', {
                companies: companies,
                application: application,
                errorMessage: 'Error creating new application'
            })

        }catch{
            res.redirect('applications')
        }
    }
})

module.exports = router
