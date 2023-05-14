//create an object that records speech to text data
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

//create an object that translates text to speech data
const utterance = new SpeechSynthesisUtterance();
utterance.voice = speechSynthesis.getVoices()[1];


//records the speech to text data
let activated = false;
recognition.onresult = async function(event) {
    let interimTranscript: string = '';
    let finalTranscript: string = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {

            
            //capture the text from the recording in a final snapshot and display it.
            finalTranscript += event.results[i][0].transcript;
            if (finalTranscript.toLowerCase().includes("hey") && finalTranscript.toLowerCase().includes("jarvis") && !activated) {
                recognition.stop();
                activated = true;
                utterance.text = "Hello, how can I help you?";
                speechSynthesis.speak(utterance);
                utterance.onend = function() {
                    recognition.start();
                };
                const responseBox =  document.getElementById("responseBox") as HTMLInputElement;
                responseBox.value = "Hello, how can I help you?";
                const status = document.getElementById("status") as HTMLInputElement;
                status.innerText = "Listening...";
                return;
            }

            //sends recording to the server for processing if the user has activated the AI
            if (activated) {
            try {
               recognition.stop();
               const status = document.getElementById("status") as HTMLInputElement;
               status.innerText = "Thinking...";
               const speechBox = document.getElementById("speechBox") as HTMLInputElement;
               speechBox.value = "";
               for (let i = 0; i < finalTranscript.length; i++) {
                speechBox.value += finalTranscript[i];
               }
               console.log(speechBox.value);
               let response: Promise<string> = requestHandler(finalTranscript);
               let responseText: string = await response;
               console.log(responseText);
               const responseBox =  document.getElementById("responseBox") as HTMLInputElement;
               responseBox.value = "";
               for (let i = 0; i < responseText.length; i++) {
                   responseBox.value += responseText[i];
               }
               console.log(responseBox.value);
               utterance.text = responseText;
               speechSynthesis.speak(utterance);
               utterance.onend = function() {
                     activated = false;
                     recognition.start();
               }
            } catch (error) {
                console.error("Browser: ", error);
                recognition.start();
            }}
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

//to start to the recording from the browser interface
function startRecording(): void {
    recognition.start();
}

if (document.getElementById("speechButton") != null) {
    document.getElementById("speechButton")!.addEventListener("click", startRecording);
  }
  