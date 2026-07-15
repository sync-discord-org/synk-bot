const { setTimeout: sleep } = require("timers/promises")

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField, EmbedBuilder,
} = require("discord.js");

module.exports = async (client, interaction) => {

    // Deletar chat caso exista
    if (interaction.customId === "ticket-close") {
        const isOwner = interaction.channel.topic === interaction.user.id;
        const isStaff = interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        );

        if (!isOwner && !isStaff) {
            await interaction.reply({
                content: "Apenas o autor do ticket ou a equipe pode fechá-lo.",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply("Este ticket sera fechado em 5 segundos.");
        await sleep(5000);
        interaction.channel.delete().catch(console.error)
        return;
    }

    // Categorizando chat
    let type = null;
    let category = null;
    if (interaction.customId === "ticket-general"){
        type = "general"
        category = interaction.guild.channels.cache.find(
            (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === "general tickets"
        );
    }else if (interaction.customId === "ticket-report"){
        type = "report"
        category = interaction.guild.channels.cache.find(
            (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === "report tickets"
        );
    }

    if (type === null) return;

    // Formatando nome do chat
    const channelName = `ticket-${type}-${interaction.user.username}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .slice(0, 90);


    const existingChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name === channelName
    );

    // Verificação se já existe algum ticket igual aberto
    if (existingChannel) {
        await interaction.reply({
            content: `Voce ja possui um ticket aberto dessa categoria: ${existingChannel}`,
            ephemeral: true,
        });
        return;
    }

    const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: interaction.user.id,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                ],
            },
        ],
    });

    // Mensagem de controle no chat
    const embed = new EmbedBuilder()
        .setColor(0x333333)
        .setTitle(`**Ticket ${interaction.member.displayName}**`)
        .setDescription("Digite sua dúvida e aguarde")
        .setImage("https://cdn.discordapp.com/attachments/1517889418545987695/1524519917347537016/ezgif.com-video-to-gif-converter.gif?ex=6a57f450&is=6a56a2d0&hm=498a59357c9592b36778305262729c2f9099a702a160db1186591107a20306ce&")
        //.setFooter({ text: "" })
        .setTimestamp();

    const closeButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ticket-close")
            .setLabel("Fechar ticket")
            .setStyle(ButtonStyle.Danger)
    );

    const topicMessage = await ticketChannel.send({
        embeds: [embed],
        components: [closeButton],
    });
    await topicMessage.pin();

    await interaction.reply({
        content: `Seu ticket foi criado: ${ticketChannel}`,
        ephemeral: true,
    });
}