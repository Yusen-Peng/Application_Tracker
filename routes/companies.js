//basic router setup
const express = require('express')
const router = express.Router()

//import the company model
const Company = require('../models/company')

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
        // res.redirect(`companies/${newCompany.id}`)
        res.redirect('/companies')
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

module.exports = router