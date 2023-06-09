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
//create an object that records speech to text data
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
//create an object that translates text to speech data
var utterance = new SpeechSynthesisUtterance();
utterance.voice = speechSynthesis.getVoices()[1];
//records the speech to text data
var activated = false;
recognition.onresult = function (event) {
    return __awaiter(this, void 0, void 0, function () {
        var interimTranscript, finalTranscript, i, responseBox, status_1, status_2, speechBox, i_1, response, responseText, responseBox, i_2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    interimTranscript = '';
                    finalTranscript = '';
                    i = event.resultIndex;
                    _a.label = 1;
                case 1:
                    if (!(i < event.results.length)) return [3 /*break*/, 8];
                    if (!event.results[i].isFinal) return [3 /*break*/, 6];
                    //capture the text from the recording in a final snapshot and display it.
                    finalTranscript += event.results[i][0].transcript;
                    if (finalTranscript.toLowerCase().includes("hey") && finalTranscript.toLowerCase().includes("jarvis") && !activated) {
                        recognition.stop();
                        activated = true;
                        utterance.text = "Hello, how can I help you?";
                        speechSynthesis.speak(utterance);
                        utterance.onend = function () {
                            recognition.start();
                        };
                        responseBox = document.getElementById("responseBox");
                        responseBox.value = "Hello, how can I help you?";
                        status_1 = document.getElementById("status");
                        status_1.innerText = "Listening...";
                        return [2 /*return*/];
                    }
                    if (!activated) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    recognition.stop();
                    status_2 = document.getElementById("status");
                    status_2.innerText = "Thinking...";
                    speechBox = document.getElementById("speechBox");
                    speechBox.value = "";
                    for (i_1 = 0; i_1 < finalTranscript.length; i_1++) {
                        speechBox.value += finalTranscript[i_1];
                    }
                    console.log(speechBox.value);
                    response = requestHandler(finalTranscript);
                    return [4 /*yield*/, response];
                case 3:
                    responseText = _a.sent();
                    console.log(responseText);
                    responseBox = document.getElementById("responseBox");
                    responseBox.value = "";
                    for (i_2 = 0; i_2 < responseText.length; i_2++) {
                        responseBox.value += responseText[i_2];
                    }
                    console.log(responseBox.value);
                    utterance.text = responseText;
                    speechSynthesis.speak(utterance);
                    utterance.onend = function () {
                        activated = false;
                        recognition.start();
                    };
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Browser: ", error_1);
                    recognition.start();
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    interimTranscript += event.results[i][0].transcript;
                    _a.label = 7;
                case 7:
                    ++i;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
};
recognition.start();
//send the text from the recording to the server
function requestHandler(info) {
    return __awaiter(this, void 0, void 0, function () {
        var queryParams, url, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryParams = new URLSearchParams({
                        info: info
                    });
                    url = 'http://localhost:3000/answer?' + queryParams.toString();
                    return [4 /*yield*/, fetch(url, { method: 'GET' })];
                case 1:
                    response = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data.message];
                case 4:
                    error_2 = _a.sent();
                    console.error("Browser: Error parsing response as JSON", error_2);
                    return [2 /*return*/, error_2.message];
                case 5: return [2 /*return*/];
            }
        });
    });
}
;
//to start to the recording from the browser interface
function startRecording() {
    recognition.start();
}
if (document.getElementById("speechButton") != null) {
    document.getElementById("speechButton").addEventListener("click", startRecording);
}
