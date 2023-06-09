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
exports.runInference = void 0;
var _a = require("@llama-node/core"), LLama = _a.LLama, LLamaInferenceArguments = _a.LLamaInferenceArguments;
var on = require("events").on;
var response = require("express").response;
var resolve = require("path").resolve;
///
var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');
// Open the file in the default browser
function getCurrentFilePath() {
    exec("cd", function (error, stdout, stderr) {
        if (error) {
            console.error("Error opening file: ".concat(error.message));
            return;
        }
        if (stderr) {
            console.error("Error opening file: ".concat(stderr));
            return;
        }
        console.log(stdout);
        openFrontEnd(stdout);
    });
}
function openFrontEnd(filePath) {
    filePath = removeAfterLastBackslash(filePath);
    filePath = filePath;
    //
    var server = http.createServer(function (req, res) {
        filePath = filePath.replace(/\\/g, "/");
        var endingPath = "/app/index.html";
        fs.readFile(filePath + endingPath, function (err, content) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Error loading HTML file at ' + filePath);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
        endingPath = "/app/client.js";
        fs.readFile(filePath + endingPath, function (err, content) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/javascript' });
                res.end('Error loading JavaScript file at ' + filePath);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(content);
            }
        });
    });
    server.listen(8080, function () {
        console.log('Server is running on http://localhost:8080');
    });
    //
    exec("start \"\" http://localhost:8080", function (error, stdout, stderr) {
        if (error) {
            console.error("Error opening file: ".concat(error.message));
            return;
        }
        if (stderr) {
            console.error("Error opening file: ".concat(stderr));
            return;
        }
        console.log("Successfully opened localhost:8080");
    });
}
function removeAfterLastBackslash(input) {
    var lastIndex = input.lastIndexOf('\\');
    if (lastIndex !== -1) {
        return input.substring(0, lastIndex);
    }
    else {
        return input;
    }
}
getCurrentFilePath();
// Create an instance of the Express application
var express = require('express');
require("dotenv").config();
/**
 * Loads the Llama module from the npm package.
 * **Make sure that these dependencies are installed with the
 * import keyword and not require in server.js when this file is transpiled.**
*/
function moduleLoader() {
    return __awaiter(this, void 0, void 0, function () {
        var LLM, LLamaRS;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return import("llama-node"); })];
                case 1:
                    LLM = (_a.sent()).LLM;
                    return [4 /*yield*/, Promise.resolve().then(function () { return import("llama-node/dist/llm/llama-rs.js"); })];
                case 2:
                    LLamaRS = (_a.sent()).LLamaRS;
                    return [2 /*return*/, new LLM(LLamaRS)];
            }
        });
    });
}
var path = require("path");
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
    var info, tokenOutput, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                info = req.query.info;
                console.log('Received data:', info);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, runInference(info)];
            case 2:
                tokenOutput = _a.sent();
                res.send({ message: tokenOutput });
                console.log('Sent data!');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res.send({ message: error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Start the server and listen for incoming requests
app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
//llama-rs inference will be computed here
function runInference(_template) {
    return __awaiter(this, void 0, void 0, function () {
        var model, llama_1, template, prompt_1, tokenCollector_1, responseToken, tokens, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    model = path.resolve(process.cwd(), "../model/ggml-model-q4_0.bin");
                    return [4 /*yield*/, moduleLoader()];
                case 1:
                    llama_1 = _a.sent();
                    llama_1.load({ path: model });
                    template = _template;
                    prompt_1 = "Below is an instruction that describes a task. Write a response that appropriately completes the request. \n\n    ### Instruction:\n\n    ".concat(template, "\n\n    ### Response:");
                    tokenCollector_1 = [];
                    responseToken = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            llama_1.createCompletion({
                                prompt: prompt_1,
                                numPredict: 128,
                                temp: 0.2,
                                topP: 1,
                                topK: 40,
                                repeatPenalty: 1,
                                repeatLastN: 64,
                                seed: 0,
                                feedPrompt: true,
                            }, function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var resolvedToken;
                                return __generator(this, function (_a) {
                                    console.log("Response token: ", response.token);
                                    console.log("Response: ", response);
                                    tokenCollector_1.push(response.token);
                                    if (response.completed === true) {
                                        resolvedToken = tokenCollector_1.toString();
                                        resolvedToken = resolvedToken.split("<end>").join("").split(",").join("");
                                        resolve(resolvedToken);
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); });
                    return [4 /*yield*/, responseToken];
                case 2:
                    tokens = _a.sent();
                    console.log("Token collector: ", tokens);
                    return [2 /*return*/, (tokens.toString())];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [2 /*return*/, new Promise(function (reject) { return reject("Failed to generate completion"); })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.runInference = runInference;
