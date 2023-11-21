const express = require('express')
const router = express.Router()
const Application = require('../models/application')

router.get('/', async (req, res) => {
  res.render('index')
})

module.exports = router