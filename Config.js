const fs = require("fs")
require("./database/module")

// GLOBAL PAYMENT
global.storename = "🕷 NO-DARA-V2 🌍"
global.dana = "50947118426" // Ton numéro de paiement
global.qris = "Aucun QR Code pour le moment"

// GLOBAL SETTINGS
global.owner = "50947118426"
global.namabot = "🤖 NO-DARA-V2"
global.nomorbot = "50947118426"
global.namaCreator = "🌟 NO-DARA CREATOR"
global.linkyt = "" // Ton lien YouTube ici si besoin
global.autoJoin = false
global.antilink = false
global.versisc = "2.0.0"

// DELAY JPM (antiflood delay pour spam)
global.delayjpm = 5500

// PANEL SETTINGS (pour Pterodactyl panel personnalisé)
global.apikey = "PLTC"
global.capikey = "PLTA"
global.domain = "https://domain.com" // Ton domaine de panel
global.eggsnya = "15"
global.location = "1"

// GLOBAL THUMB & LIENS
global.codeInvite = "" // Code d'invitation groupe auto
global.imageurl = "" // Image par défaut pour les stickers
global.isLink = "https://whatsapp.com/channel/0029Vb65QuI4IBh7NdUQCq3G"
global.packname = "🕷 NO-DARA-V2 🌍"
global.author = "👑 NO-DARA CREATOR"
global.jumlah = "5" // Valeur générique (à ajuster si nécessaire)

// 🔁 Auto-reload du fichier config.js
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(require("chalk").redBright(`Mise à jour détectée : ${__filename}`))
	delete require.cache[file]
	require(file)
})
