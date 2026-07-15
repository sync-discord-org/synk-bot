const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

if (!fs.existsSync(path.join(__dirname, "database"))) fs.mkdirSync(path.join(__dirname, "database"));

//Events
require("./events/ready.js")(client);
require("./events/messageCreate.js")(client);

client.login(process.env.DISCORD_TOKEN).then();
