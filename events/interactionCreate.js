module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {

        // Interacoes por botoes
        if (!interaction.isButton()) return;

        await require("./interactions/ticket-interaction")(client, interaction);
    });
};
