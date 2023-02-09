import { Events, Client } from "discord.js";

// when the client is ready, run this code (once)
export default {
    name: Events.ClientReady,
    once: true,

    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    },
};
