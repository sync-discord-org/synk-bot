const { setTimeout: sleep } = require("timers/promises");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
} = require("discord.js");
const { findTicketAdminRole } = require("../../utils/ticket-config");

module.exports = async (client, message) => {
    if (!message.content.startsWith("s!set-ticket-chat ")) return;

    const isAdmin = message.member?.permissions.has(
        PermissionsBitField.Flags.Administrator
    );
    const ticketAdminRole = await findTicketAdminRole(message.guild);
    const isTicketAdmin = Boolean(
        ticketAdminRole && message.member?.roles.cache.has(ticketAdminRole.id)
    );

    if (!isAdmin && !isTicketAdmin) {
        const reply = await message.reply("Apenas administradores podem executar este comando.");
        await deleteTicketChat(message, reply);
        return;
    }

    const ticketChat = commandContent.replace("set-ticket-chat ", "");
    const ticketChannel = await client.channels.fetch(ticketChat);

    const messages = await ticketChannel.messages.fetch({ limit: 1 });
    if (messages.size > 0) {
        const reply = await message.reply("O chat precisa estar vazio para configurar como chat de tickets.");
        await deleteTicketChat(message, reply);
        return;
    }

    try {
        const embed = new EmbedBuilder()
            .setColor(0x333333)
            .setTitle("**SUPORTE**")
            .setDescription("Precisa de ajuda?\nClique no botão abaixo caso necessite de suporte.")
            .setImage("https://cdn.discordapp.com/attachments/1517889418545987695/1524519917347537016/ezgif.com-video-to-gif-converter.gif?ex=6a57f450&is=6a56a2d0&hm=498a59357c9592b36778305262729c2f9099a702a160db1186591107a20306ce&")
            .setFooter({ text: "Criacao de tickets desnecessarios pode acarretar em penalizacoes." })
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket-general")
                .setLabel("Suporte geral")
                .setEmoji("1️⃣")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("ticket-report")
                .setLabel("Denuncia")
                .setEmoji("2️⃣")
                .setStyle(ButtonStyle.Danger)
        );

        await ticketChannel.send({ embeds: [embed], components: [buttons] });
        await ticketChannel.permissionOverwrites.edit(ticketChannel.guild.roles.everyone, {
            SendMessages: false,
        });
        await ticketChannel.permissionOverwrites.edit(client.user.id, {
            SendMessages: true,
        });

        const reply = await message.reply("Chat de ticket definido com sucesso.");
        await deleteTicketChat(message, reply);
    } catch (error) {
        console.error(error);
        const reply = await message.reply("Nao foi possivel concluir a acao.");
        await deleteTicketChat(message, reply);
    }
};

async function deleteTicketChat(message, reply) {
    await sleep(3000);
    await reply.delete();
    await message.delete();
}
