const fs = require('fs');
const config = require('./config.json');
const discord = require('discord.js');
const { WebhookClient } = require('discord.js');

/* 
 * Chargement des dépendances dynamiques
 */
async function loadDependencies() {
  const chalkModule = await import('chalk');
  const gradientModule = await import('gradient-string');
  return { chalk: chalkModule.default, gradient: gradientModule.default };
}

/* 
 * Initialisation du client Discord
 */
const client = new discord.Client({ intents: 32767 });
client.commands = new discord.Collection();

/* 
 * Chargement des événements
 */
const loadEvents = () => {
  const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
  }
};

/* 
 * Chargement des commandes
 */
const loadCommands = () => {
  const cmdZeRwYX = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
  for (const file of cmdZeRwYX) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
};

loadEvents();
loadCommands();

console.log(`Slash Commands:`);
console.log(client.commands);

/* 
 * Gestion des erreurs
 */
const webhookClient = new WebhookClient({
  id: config.webhookId,
  token: config.webhookToken
});

process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée :', error);
  sendErrorMessage(error);
});

function sendErrorMessage(error) {
  const errorMessage = `Une erreur s'est produite :\n\`\`\`${error.stack}\`\`\``;
  webhookClient.send(errorMessage)
    .then(() => console.log('Message d\'erreur envoyé avec succès.'))
    .catch((error) => console.error('Erreur lors de l\'envoi du message d\'erreur :', error));
}

try {
  throw new Error('Une erreur s\'est produite !');
} catch (error) {
  sendErrorMessage(error);
}

/* 
 * Exécution du client Discord
 */
client.on('ready', async () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  try {
    await Promise.all(client.guilds.cache.map(guild => guild.commands.set(client.commands)));
    console.log(`Commandes déployées sur tous les serveurs.`);
  } catch (error) {
    console.error(`Erreur lors du déploiement des commandes : ${error}`);
  }

  if (config.Ascii) {
    const { chalk, gradient } = await loadDependencies();
    await logBanner(chalk, gradient);
    console.log(chalk.green('discord.gg/ZeRwYX'));
  } else {
    const { chalk } = await loadDependencies();
    console.log(chalk.green('discord.gg/ZeRwYX'));
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName.toLowerCase());
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

/* 
 * Fonction pour afficher la bannière ASCII
 */
async function logBanner(chalk, gradient) {
  const figletModule = await import('figlet');
  const figlet = figletModule.default;
  const bannerText = config.AsciiContent;
  console.clear();
  figlet(bannerText, (err, data) => {
    if (err) {
      console.error(chalk.red('Erreur lors de la génération de l\'ASCII art'));
      console.dir(err);
      return;
    }
    const gradientAscii = gradient.rainbow(data);
    console.log(gradientAscii);
  });
}

client.login(config.botToken);
