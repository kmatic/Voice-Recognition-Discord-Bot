import { Porcupine, BuiltinKeyword } from "@picovoice/porcupine-node";

export default function detectHotword(audioFrame: any) {
    console.log("pico init");
    const accessKey = process.env.PICOVOICE_ACCESS_KEY as string;

    const porcupine = new Porcupine(
        accessKey,
        [BuiltinKeyword.GRASSHOPPER, BuiltinKeyword.BUMBLEBEE],
        [0.5, 0.65]
    );

    const keywordIndex = porcupine.process(audioFrame);

    if (keywordIndex === 0 || keywordIndex === 1) {
        console.log("hotword");
        return true;
    } else {
        console.log("no hotword");
    }

    return false;
}
