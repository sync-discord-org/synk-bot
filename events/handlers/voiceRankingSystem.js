const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, "../../database/voiceRanking.json");

const VOICE_XP_PER_MINUTE = 10;
const CHECK_INTERVAL_MS = 60 * 1000;

// Sessões de voz ativas em memória: userId -> { guildId, channelId, joinedAt }
const activeSessions = new Map();

function dataLoad() {
    try {
        if (!fs.existsSync(DB_PATH)) return {};
        const conteudo = fs.readFileSync(DB_PATH, "utf8");
        return JSON.parse(conteudo);
    } catch (e) {
        console.error("[VoiceRankingSystem] Erro ao carregar o arquivo em JSON:", e);
        return {};
    }
}

function dataSave(dados) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2), "utf-8");
    } catch (e) {
        console.error("[VoiceRankingSystem] Erro ao salvar o arquivo em JSON:", e);
    }
}

function xpToNextLevel(level) {
    return Math.floor(120 * Math.pow(level + 1, 1.9));
}

async function findAnnounceChannel(guild) {
    if (!guild) return null;
    try {
        if (guild.systemChannel) {
            const perms = guild.systemChannel.permissionsFor(guild.members.me);
            if (perms?.has("SendMessages")) return guild.systemChannel;
        }
        const canais = await guild.channels.fetch().catch(() => null);
        if (!canais) return null;
        return (
            canais.find(
                (c) => c?.isTextBased?.() && c.permissionsFor(guild.members.me)?.has("SendMessages")
            ) ?? null
        );
    } catch (e) {
        return null;
    }
}

async function grantVoiceXp(userId, guild, minutos) {
    if (!minutos || minutos <= 0) return;

    const data = dataLoad();
    if (!data[userId]) {
        data[userId] = { xp: 0, level: 0 };
    }

    data[userId].xp += Math.floor(minutos * VOICE_XP_PER_MINUTE);

    let subiuDeLevel = false;
    while (data[userId].xp >= xpToNextLevel(data[userId].level)) {
        data[userId].level++;
        subiuDeLevel = true;
    }

    dataSave(data);

    if (subiuDeLevel && guild) {
        const canal = await findAnnounceChannel(guild);
        if (canal) {
            canal
                .send(`🎉 <@${userId}> subiu para o level ${data[userId].level} no ranking de voz!`)
                .catch(() => null);
        }
    }
}

function onVoiceStateUpdate(oldState, newState) {
    const member = newState.member ?? oldState.member;
    if (!member || member.user.bot) return;

    const userId = member.id;
    const guild = newState.guild ?? oldState.guild;
    const afkChannelId = guild?.afkChannelId;

    const estavaEm = oldState.channelId;
    const agoraEm = newState.channelId;

    // Só mudou mute/deafen/etc, continua no mesmo canal -> ignora
    if (estavaEm === agoraEm) return;

    // Entrou em um canal de voz válido (não é o AFK)
    if (agoraEm && agoraEm !== afkChannelId) {
        if (!activeSessions.has(userId)) {
            activeSessions.set(userId, { guildId: guild.id, channelId: agoraEm, joinedAt: Date.now() });
        } else {
            activeSessions.get(userId).channelId = agoraEm;
        }
    }

    // Saiu da call (desconectou ou foi pro canal AFK)
    if ((!agoraEm || agoraEm === afkChannelId) && activeSessions.has(userId)) {
        const sessao = activeSessions.get(userId);
        const minutos = (Date.now() - sessao.joinedAt) / 60000;
        activeSessions.delete(userId);
        grantVoiceXp(userId, guild, minutos).then();
    }
}

// Roda a cada CHECK_INTERVAL_MS: credita o XP acumulado de quem está em call
// e reseta o "checkpoint", pra não perder progresso em caso de restart do bot
function tickActiveSessions(client) {
    for (const [userId, sessao] of activeSessions.entries()) {
        const minutos = (Date.now() - sessao.joinedAt) / 60000;
        sessao.joinedAt = Date.now();

        const guild = client.guilds.cache.get(sessao.guildId);
        grantVoiceXp(userId, guild, minutos).then();
    }
}

// Ao ligar o bot, começa a rastrear quem já está em canais de voz naquele momento
function initExistingSessions(client) {
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache
            .filter((c) => c.isVoiceBased?.() && c.id !== guild.afkChannelId)
            .forEach((canalVoz) => {
                canalVoz.members.forEach((membro) => {
                    if (membro.user.bot) return;
                    if (!activeSessions.has(membro.id)) {
                        activeSessions.set(membro.id, {
                            guildId: guild.id,
                            channelId: canalVoz.id,
                            joinedAt: Date.now(),
                        });
                    }
                });
            });
    });
}

module.exports = {
    onVoiceStateUpdate,
    tickActiveSessions,
    initExistingSessions,
    dataLoad,
    dataSave,
    xpToNextLevel,
    CHECK_INTERVAL_MS,
};