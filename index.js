require("dotenv").config();
﻿const fs = require("fs");
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
<<<<<<< HEAD
require("./events/rankingEvents.js")(client);
=======
require("./events/interactionCreate.js")(client);
>>>>>>> feat/ticket-system

//Atualização automática das mensagens de ranking a cada 5 minutos
require("./events/rankingUpdater.js")(client);

client.login(process.env.DISCORD_TOKEN).then();