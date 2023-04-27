// Create an instance of the Express application
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());

// Add body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define an endpoint to handle incoming GET requests
// @ts-ignore
app.get('/answer', async (req, res) => {

    const info = req.query.info as string;
    console.log('Received data:', info.length);
    let responseOutput = await connectLlama(info);
    res.send({message: responseOutput});
    console.log("Response: ", responseOutput);

});

// Start the server and listen for incoming requests
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

//llama-rs inference will be computed here
async function connectLlama(info: string) : Promise<string> {
    return info;
}