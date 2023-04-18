var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
// Create an instance of the Express application
var app = express();
app.use(cors());
// Add body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Define an endpoint to handle incoming GET requests
// @ts-ignore
app.get('/answer', function (req, res) {
    // Parse the JSON payload sent in the request's body
    var info = req.query.info;
    // Handle the info data as needed
    console.log('Received data:', info);
    // Send a response back to the client
    res.send({ message: info });
});
// Start the server and listen for incoming requests
app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
