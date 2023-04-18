//create an object that records speech to text data
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";
//records the speech to text data
recognition.onresult = function (event) {
    var interimTranscript = '';
    var finalTranscript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            //capture the text from the recording in a final snapshot
            finalTranscript += event.results[i][0].transcript;
        }
        else {
            interimTranscript += event.results[i][0].transcript;
        }
    }
    //send the text from the recording to the server
    var responseOutput = requestHandler(finalTranscript);
    console.log(responseOutput);
};
recognition.start();
//send the text from the recording to the server
function requestHandler(info) {
    var queryParams = new URLSearchParams({
        info: info
    });
    fetch('http://localhost:3000/answer?' + queryParams.toString(), { method: 'GET' })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        console.log(data.message);
        return data.message;
    })
        .catch(function (error) {
        console.error(error);
    });
}
