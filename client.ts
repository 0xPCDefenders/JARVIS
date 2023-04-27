//create an object that records speech to text data
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

//records the speech to text data
recognition.onresult = async function(event) {
    let interimTranscript = '';

    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            //capture the text from the recording in a final snapshot
            finalTranscript += event.results[i][0].transcript;
            let responseOutput = await requestHandler(finalTranscript).toString();
            console.log("Response: ", responseOutput);
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }
}

recognition.start();

//send the text from the recording to the server
async function requestHandler(info: string): Promise<string | void> {

    const queryParams = new URLSearchParams({
        info: info
    });

    fetch('http://localhost:3000/answer?'+ queryParams.toString(),
        {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            return data.message;
        })
        .catch(error => {
            console.error(error);
        });
}


