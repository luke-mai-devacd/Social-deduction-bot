const fs = require('node:fs')
const path = require('node:path')
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands') //construts path to command directory.
const commandFolders = fs.readdirSync(foldersPath) //returns array of folders contained.

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath) //returns array of files in folders.
    .filter((file) => file.endsWith('.js')) //ensures only commands are processed, commands must be written in js and not ts for reasons I still don't comprehend but whatever.
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command) //sets up the commands.
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }
}

const eventsPath = path.join(__dirname, 'events') //dittoish for events.
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    //Client extends EventEmitter and exposes .on() and .once(), these are used to register event listners.
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(token)
