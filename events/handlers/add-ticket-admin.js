const { findTicketAdminRole } = require("../../utils/ticket-config");

module.exports = async (message) => {
    //s!add-ticket-admin <@ID>
    if (!message.content.startsWith("s!add-ticket-admin")) return;

    let people;
    try {
        people = message.mentions.members.first();
        if (!people) throw new Error("Nenhum membro mencionado.");
    } catch (e) {
        console.log(e);
        return await message.reply("Membro não encontrado!");
    }

    let ticketAdminRole;
    try {
        ticketAdminRole = await findTicketAdminRole(message.guild);
        if (!ticketAdminRole) throw new Error("Cargo de ticket admin não encontrado!");
    } catch (e) {
        console.log(e);
        return await message.reply("Cargo de ticket admin não encontrado! Use ``s!create-ticket-role``");
    }

    try {
        if (people.roles.cache.has(ticketAdminRole.id)) {
            return await message.reply(`${people.user.tag} já possui o cargo de ticket admin!`);
        }
        await people.roles.add(ticketAdminRole);
        await message.reply(`${people.user.tag} agora é um ticket admin`);
    } catch (e) {
        console.log(e);
        await message.reply("Não foi possível adicionar o membro como ticket admin!");
    }
};
