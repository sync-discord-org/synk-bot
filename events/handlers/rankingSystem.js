const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, "../../database/ranking.json");
const COOLDOWN_MS = 5_000;

const cooldowns = new Map();

function dataLoad() {
    try {
        if(!fs.existsSync(DB_PATH)) {
            return {};
        }
        const conteudo = fs.readFileSync(DB_PATH, "utf8");
        return JSON.parse(conteudo);
    }catch (e){
        console.error('[RankingSystem] Erro ao carregar o arquivo em JSON:', e);
        return {};
    }
}
function dataSave(dados) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2), 'utf-8');
    } catch (e) {
        console.error('[RankingSystem] Erro ao salvar o arquivo em JSON:', e);
    }
}
function xpToNextLevel(level) {
    return Math.floor(120 * Math.pow(level + 1, 1.9));
}
function wordCounter(texto) {
    const textoLimpo = texto.trim();
    if (textoLimpo === "") return 0;
    return textoLimpo.split(/\s+/).length;
}

module.exports = (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const now = Date.now();

    //Checar cooldown
    const lastMessage = cooldowns.get(userId) ?? 0;
    if (now - lastMessage < COOLDOWN_MS) return;
    cooldowns.set(userId, now);

    //Carregar dados e pegar o registro do usuário
    const data = dataLoad();
    if (!data[userId]) {
        data[userId] = { xp: 0, level: 0 };
    }

    //Dar XP
    const wordNumbers = wordCounter(message.content);
    data[userId].xp += wordNumbers * 8;

    //Checar se subiu de level
    while (data[userId].xp >= xpToNextLevel(data[userId].level)){
        data[userId].level++;
        message.channel.send(`🎉 ${message.author} subiu para o level ${data[userId].level}!`);
    }

    //Salvar
    dataSave(data);
};

module.exports.dataLoad = dataLoad;
module.exports.dataSave = dataSave;