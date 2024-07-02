const express = require('express')
const path = require('path')
const forecast = require('./utils/forecast')
const hbs  = require('hbs')

//to store our express applcation
const app = express()
const port = process.env.PORT || 40001

// ====>define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')

// connection to the templates folder
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')
//====>setup handlerbars engine and views location
//set a value for a given express
app.set('view engine', 'hbs')

//seting the path
app.set('views', viewsPath)

//setting up the partials directory
hbs.registerPartials(partialPath)

// ======>setup static directory to serve
//app.use : customize ur server
app.use(express.static(publicDirectoryPath))

//index page in the express
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Wather'
    })
})

 app.get('/weather', (req, res) => {
     if(!req.query.address) {
         return res.send({
             error: 'You must provide a address!!'
         })
     }

     forecast(req.query.address, (error, location, forecastData) => {
         if(error) {
             return res.send({ error })
         }

         res.send({
             forecast: forecastData,
             location,
             address: req.query.address
         })

     })
})

app.get('*', (req, res) => {
   res.render('404', {
       title: '404',
       name: 'Page Not found',
       errorMessage: 'Page Not found'
   })
})

// this starts up the server and listen on a specific port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})