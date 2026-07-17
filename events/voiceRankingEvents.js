const {
    onVoiceStateUpdate,
    tickActiveSessions,
    initExistingSessions,
    CHECK_INTERVAL_MS,
} = require("./handlers/voiceRankingSystem.js");

module.exports = (client) => {
    client.once("ready", () => {
        initExistingSessions(client);
        console.log("[VoiceRanking] Sessões de voz já ativas foram carregadas.");
    });

    client.on("voiceStateUpdate", (oldState, newState) => {
        onVoiceStateUpdate(oldState, newState);
    });

    setInterval(() => tickActiveSessions(client), CHECK_INTERVAL_MS);

    console.log("[VoiceRanking] Rastreamento de canais de voz iniciado.");
};