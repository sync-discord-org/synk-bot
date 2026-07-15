const fs = require("fs");
const path = require("path");
const { setTimeout: sleep } = require("timers/promises")

const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = async (client, message) => {
    const commandContent = message.content.replace("s! ", "");

    if (commandContent.startsWith("ticket-chat ")){
        // Admin verification
        const isAdmin = message.member?.permissions.has(
            PermissionsBitField.Flags.Administrator
        );

        if (!isAdmin) {
            const reply = await message.reply("Apenas administradores podem executar este comando.");
            await sleep(3000);
            await reply.delete();
            await message.delete();

            return;
        }

        // ========= Comand Core

        const ticketChat = commandContent.replace("ticket-chat ", "");

        try {
            const ticketChannel = await client.channels.fetch(ticketChat);

            if (!ticketChannel || !ticketChannel.isTextBased() || !ticketChannel.guild) {
                throw new Error("O ID informado nao corresponde a um canal de texto do servidor");
            }

            const embed = new EmbedBuilder()
                .setColor(0x333333)
                .setTitle("**SUPORTE**")
                .setDescription("Precisa de ajuda?\nClique no botão abaixo caso necessite de suporte.")
                .setImage("https://cdn.discordapp.com/attachments/1517889418545987695/1524519917347537016/ezgif.com-video-to-gif-converter.gif?ex=6a57f450&is=6a56a2d0&hm=498a59357c9592b36778305262729c2f9099a702a160db1186591107a20306ce&")
                .setFooter({ text: "Criacao de tickets desnecessarios pode acarretar em penalizacoes." })
                .setTimestamp();

            // Set chat permissions
            await ticketChannel.permissionOverwrites.edit(ticketChannel.guild.roles.everyone, {
                SendMessages: false,
            });
            await ticketChannel.permissionOverwrites.edit(client.user.id, {
                SendMessages: true,
            });

            await ticketChannel.send({ embeds: [embed] });

            // Read and Write database
            const filePath = path.join(__dirname, "../../database/ticket.json");
            const fileContent = fs.existsSync(filePath)
                ? fs.readFileSync(filePath, "utf8")
                : "{}";
            const data = fileContent.trim() ? JSON.parse(fileContent) : {};

            data.ticketChat = ticketChat;
            fs.writeFileSync(filePath, JSON.stringify(data));

            const reply = await message.reply("Chat de ticket definido com sucesso.");
            await sleep(3000);
            await reply.delete();
            await message.delete();

        }catch (error) {
            console.error(error);
            await message.reply("Nao foi possivel concluir a acao.");
        }
    }
}
