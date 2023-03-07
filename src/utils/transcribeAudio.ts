const speech = require("@google-cloud/speech");
// import speech from "@google-cloud/speech";

export default async function transcribeAudio(inputAudio: Buffer) {
    // instantiate google cloud speech client
    const client = new speech.SpeechClient(); // use auth with ADC

    const config = {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-us",
    };

    const audio = {
        content: inputAudio,
    };

    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
        .map((result: any) => result.alternatives[0].transcript)
        .join("\n");
    console.log("Billed time: ", response.totalBilledTime);
    console.log("Transcription: ", transcription);

    return transcription;
}
