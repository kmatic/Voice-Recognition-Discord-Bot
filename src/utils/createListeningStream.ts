import { VoiceReceiver, EndBehaviorType } from "@discordjs/voice";
import { OpusEncoder } from "@discordjs/opus";
import detectHotword from "./detectHotword";
import prism from "prism-media";

export default function createListeningStream(receiver: VoiceReceiver, userId: string) {
    return new Promise((resolve, reject) => {
        const encoder = new OpusEncoder(16000, 1);
        const inputBuffer = [];
        const outputBuffer: Buffer[] = [];
        let hotwordDetected = false;

        // creates a readable stream of opus packets from user voice
        const opusStream = receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 500,
            },
        });

        const decodedStream = new prism.opus.Decoder({ rate: 16000, channels: 1, frameSize: 640 });

        opusStream.pipe(decodedStream);

        decodedStream.on("data", (chunk) => {
            const decodedChunk = chunk;

            if (!hotwordDetected) {
                inputBuffer.push(decodedChunk);
                hotwordDetected = detectHotword(decodedChunk);
            }

            if (hotwordDetected) {
                outputBuffer.push(decodedChunk);
            }
        });

        decodedStream.on("end", () => {
            const inputAudio = Buffer.concat(outputBuffer);

            if (hotwordDetected) {
                // hotwordDetected = false;
                resolve(inputAudio);
            }

            resolve([]);
        });

        // decodedStream.on("error", (error) => {
        //     reject(new Error("something went wrong"));
        // });
    });
}
