import { EndBehaviorType, VoiceReceiver } from "@discordjs/voice";
import { OpusEncoder } from "@discordjs/opus";

export default function createListeningStream(receiver: VoiceReceiver, userId: string) {
    return new Promise((resolve, reject) => {
        const encoder = new OpusEncoder(16000, 1);
        const buffer: Buffer[] = [];

        // creates a readable stream of opus packets from user voice
        const opusStream = receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 500,
            },
        });

        opusStream.on("data", (chunk) => {
            buffer.push(encoder.decode(chunk));
        });

        opusStream.on("end", () => {
            const inputAudio = Buffer.concat(buffer);
            resolve(inputAudio);
        });

        opusStream.on("error", (error) => {
            reject([]);
        });
    });
}
