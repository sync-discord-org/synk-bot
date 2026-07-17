const fs = require("fs");
const path = require("path");
const STORE_PATH = path.join(__dirname, "../../database/voiceRankingMessages.json");

function loadTrackedMessages() {
    try {
        if (!fs.existsSync(STORE_PATH)) return {};
        const conteudo = fs.readFileSync(STORE_PATH, "utf8");
        return JSON.parse(conteudo);
    } catch (e) {
        console.error("[VoiceRankingMessageStore] Erro ao carregar mensagens rastreadas:", e);
        return {};
    }
}

function saveTrackedMessages(dados) {
    try {
        fs.writeFileSync(STORE_PATH, JSON.stringify(dados, null, 2), "utf-8");
    } catch (e) {
        console.error("[VoiceRankingMessageStore] Erro ao salvar mensagens rastreadas:", e);
    }
}

module.exports = { loadTrackedMessages, saveTrackedMessages };