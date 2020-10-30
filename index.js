const express = require('express')
const app = express()
const cors = require("cors")

//const path = require('path')
const PORT = process.env.PORT || 5000
require('dotenv').config()  




app.use(cors())
app.use(express.json({ extended: false }))




if(process.env.NODE_ENV === "production") {
    app.use("/", express.static("./client/build"))
  }


  //Routes
  app.use('/calendar', require('./routes/calendar')) 


  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"))     
  })


  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})