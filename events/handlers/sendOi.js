module.exports = async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "oi") {
        message.reply("oi");
    }
}