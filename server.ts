const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Create an instance of the Express application
const app = express();
app.use(cors());
// Add body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Define an endpoint to handle incoming GET requests
// @ts-ignore
app.get('/answer', (req, res) => {
    // Parse the JSON payload sent in the request's body
    const info = req.query.info as string;
    // Handle the info data as needed
    console.log('Received data:', info);
    // Send a response back to the client
    res.send({ message: info });
});
// Start the server and listen for incoming requests
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});