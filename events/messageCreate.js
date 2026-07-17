module.exports = (client) => {
    client.on("messageCreate", (message) => {
        if (message.author.bot) return;

        if (!message.content.startsWith("s!")) return;

        require("./handlers/set-ticket-chat.js")(client, message);
        require("./handlers/create-ticket-role.js")(message);
        require("./handlers/add-ticket-admin.js")(message);
    });
};