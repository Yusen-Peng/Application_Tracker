//basic router setup
const express = require('express')
const router = express.Router()

//import the company model
const Company = require('../models/company')


//import the application model
const Application = require('../models/application')

//all companies route
router.get('/', async (req, res) =>{

    //implement the search options
    let searchOptions = {}
    //Note: get request sends information through a query string
    if(req.query.name != null && req.query.name != ''){
        //configure the JSON if name is valid
        //RegExp: used for matching text with a pattern
        searchOptions.name = new RegExp(req.query.name , 'i') //'i': case-insensitive
    }

    try{
        //find everything in the Company model
        const companies = await Company.find(searchOptions)
        res.render('companies/index', {
            //only render selected companies
            companies: companies,
            //save the search field text for the user by sending the query back
            searchOptions: req.query
        })

    }catch{
        //if any error occurs, redirect to the home page
        res.redirect('/')
    }
})

//new company route -- display the form
router.get('/new', (req, res) => {
    res.render('companies/new', {company: new Company()})
})

//create company route -- create a new company
//async: define a function as asynchronous
router.post('/', async (req, res) =>{
    //create the new company
    const company = new Company({
        //Note: post request sends information through the body
        name: req.body.name
    })

    try{
        //save the new company
        //await Keyword:
        //used inside an async function to wait for a promise to be resolved.
        const newCompany = await company.save()
        
        //redirect to this company's page
        res.redirect(`/companies/${newCompany.id}`)
    }catch{
        //if error occurs, re-render the new page
        res.render('companies/new', {
        //send the company back to the new page
            company: company,
            //also send an error message
            errorMessage: 'ERROR creating company'
        })
    }
})

//Note: colon indicates a dynamic parameter
//a specific company route
router.get('/:id', async (req, res) =>{
    
    try{
        //get the company and applications associated with it
        const company = await Company.findById(req.params.id)
        //find relevant applications; note that application.company is an ID object
        const applicationsToCompany = await Application.find({company: company.id}).limit(10).exec()
        
        //render the show page of a specific company
        res.render('companies/show', {
            company: company, 
            applicationsToCompany: applicationsToCompany
        })
    }catch{
        //if either fails, go back to the home page
        res.redirect('/')
    }
})


//a specific company edit route
router.get('/:id/edit', async(req, res) =>{
    try{
        //fetch the company from the database
        const company = await Company.findById(req.params.id)
        //render the edit page
        res.render('companies/edit', {company: company})
        
    }catch{
        res.redirect('companies')
    }
})

//update the company route
router.put('/:id', async (req, res)=>{
    let company
    try{
        //get the company by ID
        company = await Company.findById(req.params.id)

        //change the name (use req.body)
        company.name = req.body.name

        //save the changes to the company
        await company.save()
        //redirect to this company's page
        res.redirect(`/companies/${company.id}`)
    }catch{
        
        if(company == null){
            //if the company is not fetched properly
            res.redirect('/')
        }else{
            //if the company is not saved properly
            //re-render the edit page
            res.render('companies/edit', {
            //send the company back to the new page
                company: company,
                //also send an error message
                errorMessage: 'ERROR updating company'
            })
        }
    }
})

//delete the company route
router.delete('/:id', async (req, res) =>{
    let company
    try{
        //get the company by ID
        await Company.deleteOne(await Company.findById(req.params.id))
        
        //redirect to all companies page
        res.redirect('/companies')

    }catch{
        
        if(company == null){
            //if the company is not fetched properly
            res.redirect('/')
        }else{
            //if the company is not deleted properly
            //redirect to that company's page
            res.redirect(`/companies/${company.id}`)   
        }
    }
})


module.exports = router