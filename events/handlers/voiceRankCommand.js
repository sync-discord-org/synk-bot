const { buildVoiceRankingEmbed } = require("./voiceRankingEmbed.js");
const { loadTrackedMessages, saveTrackedMessages } = require("./voiceRankingMessageStore.js");

module.exports = (message) => {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith("s!vrankmsg")) return;

    const args = message.content.trim().split(/\s+/);
    const channelId = args[1];

    if (!channelId) {
        return message.reply("Uso correto: `s!vrankmsg {id do canal}`");
    }

    const canal = message.client.channels.cache.get(channelId);
    if (!canal) {
        return message.reply("Não encontrei nenhum canal com esse ID.");
    }

    const embed = buildVoiceRankingEmbed();
    if (!embed) {
        return message.reply("Ainda não há dados de ranking de voz.");
    }

    (async () => {
        const tracked = loadTrackedMessages();
        const oldMessageId = tracked[channelId];

        if (oldMessageId) {
            const antiga = await canal.messages.fetch(oldMessageId).catch(() => null);
            if (antiga) await antiga.delete().catch(() => null);
        }

        const novaMensagem = await canal.send({ embeds: [embed] });

        tracked[channelId] = novaMensagem.id;
        saveTrackedMessages(tracked);
    })();
};