import { Porcupine } from "@picovoice/porcupine-node";

export default function detectHotword(audioFrame: any, porcupine: Porcupine): boolean {
    const keywordIndex = porcupine.process(audioFrame);

    if (keywordIndex !== -1) {
        console.log("hotword detected");
        return true;
    }

    return false;
}
