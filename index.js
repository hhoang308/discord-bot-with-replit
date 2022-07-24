// *IMPORTANT* Read the Readme or go to the Markdown tab next to the shell. (There are a few steps you need to do before running this)
const { Discord, Client, Collection, MessageEmbed, Intents } = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_INVITES'] });

const fetch = require('cross-fetch');

const keepAlive = require("./server")

const Database = require("@replit/database")
const db = new Database()

const sadWords = ["ngu", "con cho", "gay", "thieu nang", "con chó", "thiểu năng"]
const starterEncouragements = [
  "Tuan ngu",
  "Tuan nguu"
]

console.log("NodeJS Version: " + process.version)
db.get("encouragements").then(encouragements => {
  console.log("Database set")
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set('encouragements', encouragements)
  })
}

function deleteEncouragement(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
  })
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random").then(res => {
    return res.json()
  }).then(data => {
    return data[0]["q"] + " -" + data[0]["a"]
  })
}

client.on('ready', () => {
  console.log(`${client.user.tag} is online!`)
})

client.on("messageCreate", msg => {
  if (msg.author.bot) return

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  db.get("responding").then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
      })
    }
  })

  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }
  if (msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncouragement(index)
    msg.channel.send("New encouraging message deleted.")
  }
  if (msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }
  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("responding ")[1]

    if (value.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on")
    } else {
      db.set("responding", false)
      msg.channel.send("Responding is off")
    }
  }
})

keepAlive()
client.login(process.env.TOKEN)