const Discord = require("discord.js");

require("dotenv").config();

// ---------------------------------------------------------------------
// code from Part 1 & Part 2

// const imageWelcome = require("./imageWelcome");
// ---------------------------------------------------------------------

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});

let bot = {
  client,
  prefix: "n.",
  owners: ["328619106058108938"],
};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) =>
  require("./handlers/commands")(bot, reload);

client.loadEvents(bot, false);
client.loadCommands(bot, false);

client.slashCommands = new Discord.Collection();

client.loadSlashCommands = (bot, reload) =>
  require("./handlers/slashCommands")(bot, reload);
client.loadSlashCommands(bot, false);

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  if (!interaction.inGuild()) {
    return interaction.reply("This command can only be used in a server");
  }

  const slashCmd = client.slashCommands.get(interaction.commandName);

  if (!slashCmd) {
    return interaction.reply("Invaild slash command");
  }

  if (slashCmd.perm && !interaction.member.permissions.has(slashCmd.perm)) {
    return interaction.reply("You do not have permission for this command");
  }

  slashCmd.run(client, interaction);
});

module.exports = bot;

// ---------------------------------------------------------------------
// code from Part 1 & Part 2

// client.on("ready", () => {
//   console.log(`Loged in as ${client.user.tag}`);
// });

// client.on("messageCreate", (message) => {
//   if (message.content == "hi") {
//     message.reply("Hello World!");
//   }
// });

// const botLogsId = "946769680163536947";

// client.on("guildMemberAdd", async (member) => {
//   const img = await imageWelcome(member);
//   member.guild.channels.cache.get(botLogsId).send({
//     content: `<@${member.id}> Welcome to the server!`,
//     files: [img],
//   });
// });

// ---------------------------------------------------------------------

client.login(process.env.TOKEN);
