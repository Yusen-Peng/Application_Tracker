/**
 * 
 * 
 */


//load up different dependencies unless the app is under production
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//basic server setup
const express = require('express')
const app = express()

//import express layouts package
const expressLayouts = require('express-ejs-layouts')

//import the body parser to parse data in the request
const bodyParser = require('body-parser')

//import the index router
const indexRouter = require('./routes/index')

//import the company router
const companyRouter = require('./routes/companies')

//import the application router
const applicationRouter = require('./routes/applications')


//set up the view engine
app.set('view engine', 'ejs')

//set where views will be
app.set('views', __dirname + '/views')

//set where layout files will be
app.set('layout', 'layouts/layout')

//we will use expressLayouts
app.use(expressLayouts)

//set where public files will be
app.use(express.static('public'))

//use the bodyParser.urlencoded since data are sent by url
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

//set up MongoDB database
const mongoose = require('mongoose')

//connect the database based on the environment file
mongoose.connect(process.env.DATABASE_URL)

//get the database connection
const db = mongoose.connection

//report an error message if any occurs when connecting to a database
db.on('error', error => console.error(error))

//report success when the database is opened; only run once 
db.once('open', () => console.log('Connected to Mongoose'))

//link the index router to a particular path
app.use('/', indexRouter)

//link the company router to a particular path
app.use('/companies', companyRouter)

//link the application router to a particular path
app.use('/applications', applicationRouter)

//listen to the port in the environment file; default 3000
app.listen(3000)
