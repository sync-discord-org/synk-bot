const fs = require("fs");
const path = require("path");

function getTicketAdminRole() {
    const dataPath = path.join(__dirname, "../../database/ticket.json");

    if (!fs.existsSync(dataPath)) return null;

    const data = JSON.parse(fs.readFileSync(dataPath));
    return data.ticketAdminRole || null;
}

module.exports = async (message) => {
    //s!add-ticket-admin <@ID>
    if (!message.content.startsWith("s!add-ticket-admin")) return;

    // Encontrar o membro
    let people;
    try {
        people = message.mentions.members.first();
        if (!people) throw new Error("Nenhum membro mencionado.");
    } catch (e) {
        console.log(e);
        return await message.reply("Membro não encontrado!");
    }

    // Encontrar o cargo
    let ticketAdminRole;
    try {
        const ticketAdminRoleID = getTicketAdminRole();
        ticketAdminRole = await message.guild.roles.fetch(ticketAdminRoleID);

        if (!ticketAdminRole) throw new Error("Cargo de ticket admin não encontrado! Use ``s!create-ticket-role``");
    }catch (e)
    {
        console.log(e);
        return await message.reply("Cargo de ticket admin não encontrado! Use ``s!create-ticket-role``");
    }

    // Adicionar membro ao cargo
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
}
