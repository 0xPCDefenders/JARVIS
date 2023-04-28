"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create an instance of the Express application
var express = require('express');
require("dotenv").config();
// inference.ts

async function moduleLoader() {
const { LLM } = await import("llama-node");
const { LLamaRS } = await import("llama-node/dist/llm/llama-rs.js");
return new LLM(LLamaRS);
}

var path = require("path");
//const runInference = require("inference.js");
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.use(cors());
// Add body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Define an endpoint to handle incoming GET requests
// @ts-ignore
app.get('/answer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var info, responseOutput;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                info = req.query.info;
                console.log('Received data:', info.length);
                return [4 /*yield*/, connectLlama(info)];
            case 1:
                responseOutput = _a.sent();
                res.send({ message: responseOutput });
                console.log("Response: ", responseOutput);
                return [2 /*return*/];
        }
    });
}); });
// Start the server and listen for incoming requests
app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
//llama-rs inference will be computed here
function connectLlama(info) {
    return __awaiter(this, void 0, void 0, function () {
        var completionToken, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runInference(info)];
                case 1:
                    completionToken = _a.sent();
                    return [2 /*return*/, completionToken];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    throw new Error('Failed to generate completion');
                case 3: return [2 /*return*/];
            }
        });
    });
}
async function runInference(_template) {
    try {
        var model = path.resolve(process.cwd(), "model/ggml-model-q4_0.bin");
        
        const llama = await moduleLoader();
        llama.load({ path: model });
        var template = _template;
        var prompt_1 = "Below is an instruction that describes a task. Write a response that appropriately completes the request.\n    \n    ### Instruction:\n    \n    ".concat(template, "\n    \n    ### Response:");
        llama.createCompletion({
            prompt: prompt_1,
            numPredict: 128,
            temp: 0.2,
            topP: 1,
            topK: 40,
            repeatPenalty: 1,
            repeatLastN: 64,
            seed: 0,
            feedPrompt: true,
        }, function (response) {
            process.stdout.write(response.token);
            return new Promise(function (resolve) { return resolve(response.token); });
        });
    }
    catch (error) {
        console.error(error);
        return new Promise(function (reject) { return reject("Failed to generate completion"); });
    }
}
;
