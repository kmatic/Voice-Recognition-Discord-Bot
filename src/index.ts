import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { generateDependencyReport } from "@discordjs/voice";

declare module "discord.js" {
    interface Client {
        textCommands: Collection<unknown, any>;
        voiceCommands: Collection<unknown, any>;
        queueCollection: Collection<unknown, any>;
        listenConnection: Collection<unknown, any>;
        porcupineInstance: Collection<unknown, any>;
    }
}

dotenv.config();

const token = process.env.BOT_TOKEN;

// create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.textCommands = new Collection();
client.queueCollection = new Collection();
client.listenConnection = new Collection();
client.voiceCommands = new Collection();
client.porcupineInstance = new Collection();

const textCommandsPath = path.join(__dirname, "commands/text");
const textCommandFiles = fs.readdirSync(textCommandsPath).filter((file) => file.endsWith(".ts"));

const voiceCommandsPath = path.join(__dirname, "commands/voice");
const voiceCommandFiles = fs.readdirSync(voiceCommandsPath).filter((file) => {
    return file !== "dispatchVoiceCommand.ts" && file.endsWith(".ts");
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

// register slash(text) commands
for (const file of textCommandFiles) {
    const filePath = path.join(textCommandsPath, file);
    const command = require(filePath).default;
    if ("data" in command && "execute" in command) {
        client.textCommands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

// register voice commands
for (const file of voiceCommandFiles) {
    const filePath = path.join(voiceCommandsPath, file);
    const command = require(filePath).default;
    if ("data" in command && "execute" in command) {
        client.voiceCommands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

// register event listeners
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath).default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(token);

console.log(generateDependencyReport());
