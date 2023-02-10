import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { generateDependencyReport } from "@discordjs/voice";

declare module "discord.js" {
    interface Client {
        commands: Collection<unknown, any>;
        queueCollection: Collection<unknown, any>;
    }
}

dotenv.config();

const token = process.env.BOT_TOKEN;

// create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.commands = new Collection();
client.queueCollection = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

// register slash commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default;
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
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
