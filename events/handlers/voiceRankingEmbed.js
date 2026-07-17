const { EmbedBuilder } = require("discord.js");
const { dataLoad, VOICE_XP_PER_MINUTE } = require("./voiceRankingSystem.js");

function formatTempo(xp) {
    const totalSegundos = Math.floor((xp / VOICE_XP_PER_MINUTE) * 60);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas} h ${minutos} m ${segundos} s`;
}

function buildVoiceRankingEmbed() {
    const dados = dataLoad();
    const ranking = Object.entries(dados)
        .sort((a, b) => b[1].xp - a[1].xp)
        .slice(0, 10);

    if (ranking.length === 0) return null;

    const descricao = ranking
        .map(([userId, info], index) => {
            return `${index + 1}. <@${userId}>  Tempo: ${formatTempo(info.xp)}`;
        })
        .join("\n");

    return new EmbedBuilder()
        .setTitle("🎙️ Ranking de Voz do Servidor")
        .setDescription(descricao)
        .setColor(0x333333)
        .setTimestamp()
        .setFooter({ text: `Top ${ranking.length} membros mais ativos em voz • Atualizado automaticamente a cada 5 min` });
}

module.exports = { buildVoiceRankingEmbed };