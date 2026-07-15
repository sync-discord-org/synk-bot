const fs = require("fs");
const path = require("path");
const { setTimeout: sleep } = require("timers/promises")

module.exports = async (message, ignoreCommand=false) => {
    if (!ignoreCommand) {
        const commandContent = message.content.replace("s!", "");

        if (!commandContent.startsWith("create-ticket-role")) return;
    }

    const guild = message.guild;
    const roleName = "Ticket Admin";
    const existingRole = guild.roles.cache.find((role) => role.name === roleName);

    if (existingRole) {
        await existingRole.delete();
    }

    try {
        const role = await guild.roles.create({ name: roleName });

        const filePath = path.join(__dirname, "../../database/ticket.json");
        const fileContent = fs.existsSync(filePath)
            ? fs.readFileSync(filePath, "utf8")
            : "{}";
        const data = fileContent.trim() ? JSON.parse(fileContent) : {};

        data.ticketAdminRole = role.id;
        fs.writeFileSync(filePath, JSON.stringify(data));

        const reply = await message.reply(`Ticket admin role created: <@&${role.id}>`);
        await deleteTicketChat(message, reply);
    }catch (e) {
        console.log(e);
    }
};

// Delete ticket chat
async function deleteTicketChat(message, reply) {
    await sleep(3000);
    await reply.delete();
    await message.delete();
}

