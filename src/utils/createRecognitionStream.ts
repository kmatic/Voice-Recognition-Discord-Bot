import { VoiceReceiver, EndBehaviorType } from "@discordjs/voice";
import detectHotword from "./detectHotword";
import prism from "prism-media";
import { Porcupine } from "@picovoice/porcupine-node";
import { CommandInteraction } from "discord.js";
import { createBasicEmbed } from "./embeds";

export default function createRecognitionStream(
    receiver: VoiceReceiver,
    userId: string,
    porcupine: Porcupine,
    interaction: CommandInteraction
) {
    return new Promise((resolve, reject) => {
        const FRAME_LENGTH = porcupine.frameLength;
        let hotwordDetected = false;
        let inputBuffer: any = [];
        const outputBuffer: Buffer[] = [];

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
            if (!hotwordDetected) {
                let newFrames16 = new Array(chunk.length / 2);
                for (let i = 0; i < chunk.length; i += 2) {
                    newFrames16[i / 2] = chunk.readInt16LE(i);
                }

                inputBuffer = inputBuffer.concat(newFrames16);
                let frames = chunkArray(inputBuffer, FRAME_LENGTH);
                // inputBuffer.push(chunk);

                // let int16Arr: Int16Array = new Int16Array(Buffer.concat(inputBuffer));
                // const frames = chunkArray(int16Arr, FRAME_LENGTH);

                if (frames[frames.length - 1].length !== FRAME_LENGTH) {
                    inputBuffer = frames.pop();
                }

                for (const frame of frames) {
                    hotwordDetected = detectHotword(frame, porcupine);
                    if (hotwordDetected) {
                        const embed = createBasicEmbed("Hotword detected");
                        interaction.channel!.send({ embeds: [embed] });
                    }
                }
            } else {
                outputBuffer.push(chunk);
            }
        });

        decodedStream.on("end", () => {
            const inputAudio = Buffer.concat(outputBuffer);

            if (hotwordDetected) {
                hotwordDetected = false;
                resolve(inputAudio);
            }

            resolve([]);
        });

        decodedStream.on("error", (error) => {
            console.log(error);
            reject(new Error("something went wrong"));
        });
    });
}

function chunkArray(array: any, size: number): Int16Array[] {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, index) =>
        array.slice(index * size, index * size + size)
    );
}
