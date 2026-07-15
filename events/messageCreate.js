module.exports = (client) => {
    client.on("messageCreate", (message) => {
        if (message.author.bot) return;

        // Bot Comands
        if (!message.content.startsWith("s!")) return;

        require("./handlers/ticket-chat.js")(client, message);
    });
};