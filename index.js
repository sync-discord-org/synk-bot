require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

// Permissoes concedidas ao bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});



client.once("ready", () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// Executa cada mensagem
client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "oi") {
        message.reply("oi");
    }
});

client.login(process.env.DISCORD_TOKEN).then();
