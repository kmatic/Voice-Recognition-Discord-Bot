import { Porcupine } from "@picovoice/porcupine-node";

export default function detectHotword(audioFrame: any, porcupine: Porcupine) {
    const keywordIndex = porcupine.process(audioFrame);

    if (keywordIndex !== -1) {
        console.log("hotword");
        return true;
    }

    return false;
}
