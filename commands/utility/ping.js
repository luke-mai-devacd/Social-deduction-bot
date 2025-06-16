const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('In the street!'),
  async execute(interaction) {
    await interaction.reply('Jorking it!')
  },
}
