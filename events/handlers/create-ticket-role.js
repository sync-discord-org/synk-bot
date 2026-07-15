const { setTimeout: sleep } = require("timers/promises");
const { updateGuildConfig } = require("../../utils/ticket-config");

module.exports = async (message, ignoreCommand = false) => {
    if (!ignoreCommand) {
        const commandContent = message.content.replace("s!", "");
        if (!commandContent.startsWith("create-ticket-role")) return;
    }

    const guild = message.guild;
    const roleName = "Ticket Admin";
    const existingRole = guild.roles.cache.find((role) => role.name === roleName);

    if (existingRole) await existingRole.delete();

    try {
        const role = await guild.roles.create({ name: roleName });
        updateGuildConfig(guild.id, { ticketAdminRole: role.name });

        const reply = await message.reply(`Ticket admin role created: <@&${role.id}>`);
        await deleteTicketChat(message, reply);
    } catch (e) {
        console.log(e);
    }
};

async function deleteTicketChat(message, reply) {
    await sleep(3000);
    await reply.delete();
    await message.delete();
}
