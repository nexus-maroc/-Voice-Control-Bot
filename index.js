const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// ==== À remplir ====
const TOKEN = 'PUT_YOUR_TOKEN_HERE';
const CLIENT_ID = 'PUT_YOUR_BOT_ID_HERE';
const GUILD_ID = 'SERVERIDNOTNECESSARY';
// ===================

const commands = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Connecte le bot à ton salon vocal actuel'),
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Déconnecte le bot du salon vocal'),
].map((command) => command.toJSON());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands },
  );
  console.log('Commandes slash enregistrées.');
}

client.once('ready', async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'join') {
    const channel = interaction.member?.voice?.channel;

    if (!channel) {
      await interaction.reply({ content: "Tu dois être dans un salon vocal pour utiliser cette commande.", ephemeral: true });
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    await interaction.reply(`Connecté au salon vocal : ${channel.name}`);
    return;
  }

  if (interaction.commandName === 'leave') {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply({ content: "Je ne suis connecté à aucun salon vocal.", ephemeral: true });
      return;
    }

    connection.destroy();
    await interaction.reply("Déconnecté du salon vocal.");
  }
});

client.on('error', (err) => {
  console.error('Erreur client :', err);
});

client.login(TOKEN).catch((err) => {
  console.error('Échec de connexion. Vérifie le TOKEN.', err.message);
  process.exit(1);
});
