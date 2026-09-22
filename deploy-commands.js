const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // optionnel : mets un serveur pour un déploiement instantané

const commands = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Connecte le bot à ton salon vocal actuel'),
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Déconnecte le bot du salon vocal'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    if (GUILD_ID) {
      // Déploiement sur UN serveur : instantané, idéal pour tester.
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
      );
      console.log('Commandes déployées sur le serveur.');
    } else {
      // Déploiement global : visible sur tous les serveurs, mais peut prendre jusqu'à 1h à apparaître.
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands },
      );
      console.log('Commandes déployées globalement.');
    }
  } catch (err) {
    console.error(err);
  }
})();
