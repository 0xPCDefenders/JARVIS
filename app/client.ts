//import { start } from "repl";

//create an object that records speech to text data
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

//create an object that translates text to speech data
const utterance = new SpeechSynthesisUtterance();
utterance.voice = speechSynthesis.getVoices()[1];


//records the speech to text data
recognition.onresult = async function(event) {
    let interimTranscript: string = '';
    let finalTranscript: string = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {

            
            //capture the text from the recording in a final snapshot and display it.
            finalTranscript += event.results[i][0].transcript;

            try {
               recognition.stop();
               let response: Promise<string> = requestHandler(finalTranscript);
               let responseText: string = await response;
               console.log(responseText);
               utterance.text = responseText;
               speechSynthesis.speak(utterance);
               utterance.onend = function() {
                     recognition.start();
               }
            } catch (error) {
                console.error("Browser: ", error);
                recognition.start();
            }
        } else {
            interimTranscript += event.results[i][0].transcript;

        }
    }};

recognition.start();

//send the text from the recording to the server
async function requestHandler(info: string): Promise<string> {
        const queryParams = new URLSearchParams({
            info: info
        });

        const url = 'http://localhost:3000/answer?' + queryParams.toString();

        const response = await fetch(url, { method: 'GET' });

        try {
            let data = await response.json();
            return data.message;
        } catch (error: any) {
            console.error("Browser: Error parsing response as JSON", error);
            return error.message;
        }
};

function startRecording(): void {
    recognition.start();
}

if (document.getElementById("speechButton") != null) {
    document.getElementById("speechButton")!.addEventListener("click", startRecording);
  }
  
