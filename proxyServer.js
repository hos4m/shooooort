// Dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const shortyBaseURL = 'http://gymia-shorty.herokuapp.com'

// App
const App = express();
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

// Configure CORS
App.use(cors());
App.options('*', cors());

// Configure Axios
const shortyAPI = axios.create({
  baseURL: shortyBaseURL,
  timeout: 10000,
});

// Routes
App.post('/shorten', (req, res) => {
  let result = shortyAPI.post(`${shortyBaseURL}/shorten/`, { 'url': req.body.url })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
});

App.post('/getLinkStats', (req, res) => {
  let result = shortyAPI.get(`${shortyBaseURL}/${req.body.code}/stats/`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
})

// Start Server
App.listen('9090', () => {
  console.log('------------------------------------');
  console.log('Proxy Server is running on port 9090');
  console.log('------------------------------------');
});