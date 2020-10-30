const express = require('express')
const router = express.Router()
require('dotenv').config()
const fetch = require("node-fetch")
const moment = require('moment') 
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(
    process.env.client_id, 
    process.env.client_secret  
  )
oAuth2Client.setCredentials({
    refresh_token: process.env.refresh_token,  
})
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })





router.post('/', async(req, res)=> {
    const { name, phone, email, time, date, token } = req.body

    async function validateToken(token) {
      const secret = process.env.recaptcha_secret_key
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      {
        method: "POST"
      }
      )
      const data = await response.json()
      //console.log(data)
      return data.success
    }
    const human = await validateToken(token)
    if(!human) {
      res.send({msg: 'Something went wrong!'})
      return
    }

    const dateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format()

    const event = {
        summary: name,
        description: JSON.stringify({name, phone, email}),
        colorId: 1,
        start: {
          dateTime: dateTime,
          timeZone: 'Europe/Dublin',
        },
        end: {
          dateTime: dateTime,
          timeZone: 'Europe/Dublin',
        }, 
        attendees: [
          {
            'email': email
          },
        ],
        reminders: {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 30},
            {'method': 'email', 'minutes': 15},
          ],
        }
      }
      
     calendar.events.insert({
      //auth: auth,
      calendarId: 'primary',
      resource: event,
      sendNotifications: true
    }, function(err, event) {
      if (err) {
        console.log(err)
        res.send({msg: 'Something went wrong!'})
      }
      res.send({msg: 'Event created!'})
    });


})


module.exports = router



