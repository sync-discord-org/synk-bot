require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

//Events
require("./events/ready.js")(client);
require("./events/messageCreate.js")(client);

client.login(process.env.DISCORD_TOKEN).then();
