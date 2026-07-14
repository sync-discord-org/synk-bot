require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

// Permissoes concedidas ao bot
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

//
client.once("ready", () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN).then();