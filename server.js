const express = require('express');
const request =require('request');
const app = express();

app.set('port', (process.env.PORT|| 3001));

app.get('/api/timezone', (req, res) => {

  request(`https://timezoneapi.io/api/address/?${req.query.place}`, (err, param, response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");    
    res.json(JSON.parse(response));   
  })
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});