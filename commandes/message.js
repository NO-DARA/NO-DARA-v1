require('../settings');
const fs = require('fs');
const chalk = require('chalk');

const { jidNormalizedUser, proto, getBinaryNodeChildren, getBinaryNodeChild, generateWAMessageContent, generateForwardMessageContent, prepareWAMessageMedia, delay, areJidsSameUser, extractMessageContent, generateMessageID, downloadContentFromMessage, generateWAMessageFromContent, jidDecode, generateWAMessage, toBuffer, getContentType, getDevice } = require('@whiskeysockets/baileys');

async function LoadDataBase(Raflie, m) {
	try {
		const botNumber = await Raflie.decodeJid(Raflie.user.id);
		const isNumber = x => typeof x === 'number' && !isNaN(x)
		const isBoolean = x => typeof x === 'boolean' && Boolean(x)		
				
		let user = global.db.users[m.sender]
			if (typeof user !== 'object') global.db.users[m.sender] = {}
			if (user) {
				if (!('status_deposit' in user)) user.status_deposit = false
				if (!('saldo' in user)) user.saldo = 0
			} else {
				global.db.users[m.sender] = {
					status_deposit: false, 
					saldo: 0
				}
			}
	} catch (e) {
		throw e;
	}
}
    
module.exports = { LoadDataBase }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});
