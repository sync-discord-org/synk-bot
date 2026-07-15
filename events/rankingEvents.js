module.exports = (client) => {
    client.on("messageCreate", (message) => {
        require("./handlers/rankingSystem.js")(message);
        require("./handlers/rankCommand.js")(message);
    });
}