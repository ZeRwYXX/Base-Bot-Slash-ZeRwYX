
# Bot Discord en Node.js

Ce projet est un exemple de bot Discord développé en Node.js. Il montre comment charger des commandes et des événements dynamiquement, gérer les interactions, et envoyer des notifications d'erreur via un webhook Discord.

## Prérequis

Avant de lancer le bot, vous devez avoir Node.js installé sur votre machine. Vous pouvez le télécharger et l'installer depuis [Node.js official website](https://nodejs.org/).

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone [[[URL_DU_REPO]](https://github.com/ZeRwYXX/Base-Bot-Slash-ZeRwYX)](https://github.com/ZeRwYXX/Base-Bot-Slash-ZeRwYX/)
   cd Base-Bot-Slash-ZeRwYX
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   Créez un fichier `config.json` dans le répertoire racine du projet avec le contenu suivant :
   ```json
   {
     "botToken": "VOTRE_TOKEN_DE_BOT",
     "webhookId": "ID_DU_WEBHOOK",
     "webhookToken": "TOKEN_DU_WEBHOOK",
     "Ascii": true,
     "AsciiContent": "VOTRE_TEXTE_ASCII"
   }
   ```
   Remplacez `"VOTRE_TOKEN_DE_BOT"`, `"ID_DU_WEBHOOK"`, et `"TOKEN_DU_WEBHOOK"` par vos informations Discord.

## Utilisation

1. **Lancer le bot**
   ```bash
   node index.js
   ```

   Assurez-vous que le fichier principal de votre bot s'appelle `index.js` ou modifiez la commande ci-dessus pour correspondre au nom de votre fichier.

2. **Interactions**
   - Le bot chargera automatiquement toutes les commandes et événements.
   - Les commandes sont à utiliser dans le chat Discord via les interactions slash command.

## Structure du code

- `index.js`: Point d'entrée principal du bot qui charge les commandes, les événements, et initialise le client Discord.
- `events`: Répertoire contenant les fichiers JavaScript pour les événements Discord.
- `commands`: Répertoire contenant les fichiers JavaScript pour les commandes Discord.

## Gestion des erreurs

Les erreurs non capturées sont gérées et loggées via un webhook Discord spécifié dans `config.json`. Vous pouvez voir les messages d'erreur directement dans un canal Discord si configuré.

## Commande Ping

Le module `ping.js` définit une commande pour le bot qui permet d'afficher la latence du bot et de l'API Discord. Cette commande est un exemple de comment utiliser les `EmbedBuilder` pour créer des messages enrichis (embeds) dans Discord.

### Détails du code

- **EmbedBuilder**: Utilisé pour créer des messages enrichis. Vous pouvez configurer plusieurs options comme la couleur, le titre, et les champs du message.
- **execute**: Fonction qui est appelée lorsque la commande `/ping` est utilisée dans Discord.
- **botLatency**: Calcule la latence entre le moment où la commande a été envoyée et le moment où elle est traitée par le bot.
- **API Latence**: Représente la latence réseau entre le bot et les serveurs Discord.

```javascript
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence du bot et de l'API Discord',
    async execute(interaction) {
        const botLatency = Date.now() - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor("#ff0000") 
            .setTitle('Latences')
            .addFields(
                { name: 'Latence', value: `${botLatency}ms`, inline: true },
                { name: 'API Latence', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    },
};
```

### Explication de la commande `ping`

Cette commande permet aux utilisateurs de mesurer la latence entre le bot et l'API Discord. Voici les détails des composants utilisés dans ce script :

- **EmbedBuilder** : Utilisé pour créer des messages enrichis qui sont visuellement plus attrayants. Il est configuré avec des couleurs, des titres, et des champs pour afficher les latences.
- **execute** : Méthode principale exécutée lorsque la commande est invoquée. Elle calcule la latence du bot et de l'API, puis répond à l'utilisateur avec un embed.
- **botLatency** : Temps écoulé depuis la création de l'interaction jusqu'à sa prise en charge par le bot.
- **API Latence** : Latence mesurée du WebSocket du client, donnant un indicateur de la latence réseau du bot avec les serveurs Discord.

Exemple de commande :

```javascript
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence du bot et de l'API Discord',
    async execute(interaction) {
        const botLatency = Date.now() - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor("#ff0000") 
            .setTitle('Latences')
            .addFields(
                { name: 'Latence', value: `${botLatency}ms`, inline: true },
                { name: 'API Latence', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    },
};
```
