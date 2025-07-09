const func = require("./database/place")
const readline = require("readline");
const { Boom } = require('@hapi/boom')
const { DisconnectReason, useMultiFileAuthState, makeInMemoryStore, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const chalk = require("chalk")
const { start, success, color } = require("./lib/console") // supposé que tu as ce fichier
const usePairingCode = true
const autoJoin = false
const codeInvite = ""

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(text, resolve)
  })
};

async function startSesi() {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
  const { state, saveCreds } = await useMultiFileAuthState(`./session`)
  const { version } = await fetchLatestBaileysVersion()

  console.log(chalk.red.bold('🕷️NO-DARA-V2ヤ\n\n𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 2.0.0\n\n𝐂𝐫𝐞́𝐞 𝐏𝐚𝐫 : ZEPHYR ANG\n𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 : @ARCHANGE_TECH'))

  const connectionOptions = {
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: !usePairingCode,
    logger: pino({ level: "fatal" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  }

  const zyn = func.makeWASocket(connectionOptions)

  if (usePairingCode && !zyn.authState.creds.registered) {
    const phoneNumber = await question(chalk.green('\n𝐄𝐧𝐭𝐞𝐫 𝐘𝐨𝐮𝐫 𝐍𝐮𝐦𝐛𝐞𝐫\n𝐍𝐮𝐦𝐛𝐞𝐫 : '))
    const code = await zyn.requestPairingCode(phoneNumber.trim())
    console.log(chalk.green(`𝐘𝐨𝐮𝐫 𝐏𝐚𝐢𝐫 𝐂𝐨𝐝𝐞 : ${code} `))
  }

  store.bind(zyn.ev)

  zyn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode
      console.log(color(lastDisconnect.error, 'deeppink'))
      switch (reason) {
        case DisconnectReason.badSession:
          console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
          process.exit()
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
          console.log(color('[SYSTEM]', 'white'), color('Connection lost or closed, reconnecting...', 'deeppink'))
          process.exit()
        case DisconnectReason.connectionReplaced:
          console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
          zyn.logout()
          break
        case DisconnectReason.loggedOut:
          console.log(color(`Device Logged Out, Please Scan Again And Run.`))
          zyn.logout()
          break
        case DisconnectReason.restartRequired:
          console.log(color('Restart Required, Restarting...'))
          await startSesi()
          break
        case DisconnectReason.timedOut:
          console.log(color('Connection TimedOut, Reconnecting...'))
          startSesi()
          break
        default:
          console.log(color('Unknown disconnection reason, exiting...'))
          process.exit()
      }
    } else if (connection === "connecting") {
      start(`1`, `Connecting...`)
    } else if (connection === "open") {
      success(`1`, `CONNECTED`)
      zyn.sendMessage(`509000000@s.whatsapp.net`, { text: `\`𝐇𝐢 𝐃𝐞𝐯 NO-DARA-V2\` 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 2.0.0 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞́ 𝐚𝐯𝐞𝐜 𝐬𝐮𝐜𝐜𝐞̀𝐬 ✅` })
      if (autoJoin) zyn.groupAcceptInvite(codeInvite)
    }
  })

  zyn.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      let m = chatUpdate.messages[0]
      if (!m.message) return
      m.message = (Object.keys(m.message)[0] === 'ephemeralMessage')
        ? m.message.ephemeralMessage.message
        : m.message
      if (m.key && m.key.remoteJid === 'status@broadcast') return zyn.readMessages([m.key])
      if (!zyn.public && !m.key.fromMe && chatUpdate.type === 'notify') return
      if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
      m = func.smsg(zyn, m, store)
      require("./satan")(zyn, m, store)
    } catch (err) {
      console.log(err)
    }
  })

  zyn.ev.on('contacts.update', (update) => {
    for (let contact of update) {
      let id = zyn.decodeJid(contact.id)
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
    }
  })

  zyn.public = true
  zyn.ev.on('creds.update', saveCreds)
  return zyn
}

startSesi()

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err)
})
