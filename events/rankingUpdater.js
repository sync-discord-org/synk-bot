const { loadTrackedMessages, saveTrackedMessages } = require("./handlers/rankingMessageStore.js");
const { buildRankingEmbed } = require("./handlers/rankingEmbed.js");

const UPDATE_INTERVAL_MS = 5 * 60 * 1000;

module.exports = (client) => {
    setInterval(async () => {
        const tracked = loadTrackedMessages();
        const entries = Object.entries(tracked);

        if (entries.length === 0) return;

        const embed = buildRankingEmbed();
        if (!embed) return;

        let alterou = false;

        for (const [channelId, messageId] of entries) {
            try {
                const canal = await client.channels.fetch(channelId).catch(() => null);
                if (!canal) {
                    delete tracked[channelId];
                    alterou = true;
                    continue;
                }

                const mensagem = await canal.messages.fetch(messageId).catch(() => null);
                if (!mensagem) {
                    delete tracked[channelId];
                    alterou = true;
                    continue;
                }

                await mensagem.edit({ embeds: [embed] });
            } catch (e) {
                console.error(`[RankingUpdater] Erro ao atualizar ranking no canal ${channelId}:`, e);
            }
        }

        if (alterou) saveTrackedMessages(tracked);
    }, UPDATE_INTERVAL_MS);

    console.log("[RankingUpdater] Atualização automática de ranking iniciada (a cada 5 minutos).");
};