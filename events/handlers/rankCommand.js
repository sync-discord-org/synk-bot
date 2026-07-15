const { EmbedBuilder } = require("discord.js");
const { dataLoad } = require("./rankingSystem.js");

module.exports = (message) => {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith("s!rankmsg")) return;

    const args = message.content.trim().split(/\s+/);
    const channelId = args[1];

    if (!channelId) {
        return message.reply("Uso correto: `s!RankMsg {id do canal}`");
    }

    const canal = message.client.channels.cache.get(channelId);
    if (!canal) {
        return message.reply("Não encontrei nenhum canal com esse ID.");
    }

    const dados = dataLoad();
    const ranking = Object.entries(dados)
        .sort((a, b) => b[1].xp - a[1].xp)
        .slice(0, 10);

    if (ranking.length === 0) {
        return message.reply("Ainda não há dados de ranking.");
    }

    const medalhas = ["🥇", "🥈", "🥉"];
    const descricao = ranking
        .map(([userId, info], index) => {
            const posicao = medalhas[index] ?? `**#${index + 1}**`;
            return `${posicao} <@${userId}> — Level **${info.level}** (${info.xp} XP)`;
        })
        .join("\n");

    const embed = new EmbedBuilder()
        .setTitle("🏆 Ranking do Servidor")
        .setDescription(descricao)
        .setColor(0xffd700)
        .setTimestamp()
        .setFooter({ text: `Top ${ranking.length} membros mais ativos` });

    canal.send({ embeds: [embed] });
};