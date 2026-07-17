const { EmbedBuilder } = require("discord.js");
const { dataLoad } = require("./rankingSystem.js");

function buildRankingEmbed() {
    const dados = dataLoad();
    const ranking = Object.entries(dados)
        .sort((a, b) => b[1].xp - a[1].xp)
        .slice(0, 10);

    if (ranking.length === 0) return null;

    const medalhas = ["🥇", "🥈", "🥉"];
    const descricao = ranking
        .map(([userId, info], index) => {
            const posicao = medalhas[index] ?? `**#${index + 1}**`;
            return `${posicao} <@${userId}> — Level **${info.level}** (${info.xp} XP)`;
        })
        .join("\n");

    return new EmbedBuilder()
        .setTitle("🏆 Ranking do Servidor")
        .setDescription(descricao)
        .setColor(0x333333)
        .setTimestamp()
        .setFooter({ text: `Top ${ranking.length} membros mais ativos • Atualizado automaticamente a cada 5 min` });
}

module.exports = { buildRankingEmbed };