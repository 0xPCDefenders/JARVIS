import { LLama, LLamaInferenceArguments } from "@llama-node/core";
import { response } from "express";
import { resolve } from "path";

// Create an instance of the Express application
const express = require('express');
require("dotenv").config();

/**
 * Loads the Llama module from the npm package.
 * **Make sure that these dependencies are installed with the
 * import keyword and not require in server.js when this file is transpiled.**
*/
async function moduleLoader() {
    const { LLM } = await import("llama-node");
    const { LLamaRS } = await import("llama-node/dist/llm/llama-rs.js");
    return new LLM(LLamaRS);
}

const path = require("path");
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

    //if input is not provided, use the query parameter

    const info = req.query.info as string;
  
    console.log('Received data:', info)

    try {
    
    let tokenOutput: string | undefined = await runInference(info);
    res.send({message: tokenOutput});
    console.log('Sent data!');
  
    } catch (error) {
        console.error(error);
        res.send({message: error});
    }
});

//Start the server and listen for incoming requests
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

//llama-rs inference will be computed here
export async function runInference(_template: string): Promise<string | undefined> {
  try {
    const model = path.resolve(process.cwd(), "../model/ggml-model-q4_0.bin");
    const llama = await moduleLoader();
    llama.load({ path: model });
    const template = _template;
    /* const prompt = `Below is an instruction that describes a task. Write a response that appropriately completes the request, in full and complete sentences.

    ### Instruction:

    ${template}

    ### Response:`;

    */

    const prompt = `Below is an instruction that describes a task. Write a response that appropriately completes the request. 

    ### Instruction:

    ${template}

    ### Response:`;

    let tokenCollector: string[] = [];

    const responseToken = new Promise<string>(async (resolve, reject) => {
      llama.createCompletion(
        {
          prompt,
          numPredict: 128,
          temp: 0.2,
          topP: 1,
          topK: 40,
          repeatPenalty: 1,
          repeatLastN: 64,
          seed: 0,
          feedPrompt: true,
        },
        async (response: any) => {
          console.log("Response token: ", response.token);
          console.log("Response: ", response);
          tokenCollector.push(response.token);
          if (response.completed === true) {
            let resolvedToken = tokenCollector.toString();
            resolvedToken = resolvedToken.split("<end>").join("").split(",").join("");
            resolve(resolvedToken);
          }
          
        }
      );

    }
    );
    
    const tokens = await responseToken;
    console.log("Token collector: ", tokens);
    return(tokens.toString());
  } catch (error) {
    console.error(error);
    return new Promise((reject) => reject("Failed to generate completion"));
  }
}

  