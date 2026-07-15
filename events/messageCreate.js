module.exports = (client) => {
    client.on("messageCreate", (message) => {
        require("./handlers/sendOi.js")(message);
    });
};