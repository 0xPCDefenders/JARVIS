//create an object that records speech to text data
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

//records the speech to text data
recognition.onresult = async function(event) {
    let interimTranscript: string = '';
    let finalTranscript: string = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {

            //capture the text from the recording in a final snapshot and display it.
            finalTranscript += event.results[i][0].transcript;

            let response: Promise<string> = new Promise<string>(function(resolve, reject) { });
            try {
               let response: Promise<string> = requestHandler(finalTranscript);

               console.log(await response);
                // manipulate HTML based on response
            } catch (error) {
                console.error("Browser: ", error);
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