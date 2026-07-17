const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../database/ticket.json");

function readConfig() {
    if (!fs.existsSync(filePath)) return {};

    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent.trim() ? JSON.parse(fileContent) : {};
}

function getGuildConfig(guildId) {
    const data = readConfig();
    return data[guildId] || {};
}

function getTicketAdminRoleName(guildId) {
    return getGuildConfig(guildId).ticketAdminRole || null;
}

function updateGuildConfig(guildId, updates) {
    const data = readConfig();
    data[guildId] = {
        ...(data[guildId] || {}),
        ...updates,
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function findTicketAdminRole(guild) {
    const roleName = getTicketAdminRoleName(guild.id);
    if (!roleName) return null;

    await guild.roles.fetch();
    return guild.roles.cache.find((role) => role.name === roleName) || null;
}

module.exports = {
    findTicketAdminRole,
    updateGuildConfig,
};
