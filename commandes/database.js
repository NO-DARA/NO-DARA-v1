/* 

=========================================================================

  #- Credits By Skyzopedia
   Contact: https://6285624297893
   Youtube: https://youtube.com/@skyzodev
   Telegram: https://t.me/skyzodev
    
  Developer : https://wa.me/6285624297893
  
  -[ ! ]- Jangan hapus contact developer! hargai pembuat script ini

=========================================================================

*/

require('../settings');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
let DataBase;
global.tempatDB = 'database.json'

if (/mongo/.test(global.tempatDB)) {
	DataBase = class mongoDB {
		constructor(url, options = { useNewUrlParser: true, useUnifiedTopology: true }) {
			this.url = url
			this.data = {}
			this._model = {}
			this.options = options
		}
		
		read = async () => {
			mongoose.connect(this.url, { ...this.options })
			this.connection = mongoose.connection
			try {
				const schema = new mongoose.Schema({
					data: {
						type: Object,
						required: true,
						default: {},
					}
				})
				this._model = mongoose.model('data', schema)
			} catch {
				this._model = mongoose.model('data')
			}
			this.data = await this._model.findOne({})
			if (!this.data) {
				new this._model({ data: {} }).save()
				this.data = await this._model.findOne({})
			} else return this?.data?.data || this?.data
		}
		
		write = async (data) => {
			if (this.data && !this.data.data) return (new this._model({ data })).save()
			this._model.findById(this.data._id, (err, docs) => {
				if (!err) {
					if (!docs.data) docs.data = {}
					docs.data = data
					return docs.save()
				}
			})
		}
	}
} else if (/json/.test(global.tempatDB)) {
	DataBase = class dataBase {
		data = {}
		file = path.join(process.cwd(), 'data', global.tempatDB);
		
		read = async () => {
			let data;
			if (fs.existsSync(this.file)) {
				data = JSON.parse(fs.readFileSync(this.file))
			} else {
				fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
				data = this.data
			}
			return data
		}
		
		write = async (data) => {
			this.data = !!data ? data : global.db
			let dirname = path.dirname(this.file)
			if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
			fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
			return this.file
		}
	}
}

async function LoadDataBase(bew, m) {
	try {
		const botNumber = await bew.decodeJid(bew.user.id);
		const isNumber = x => typeof x === 'number' && !isNaN(x)
		const isBoolean = x => typeof x === 'boolean' && Boolean(x)
		let setBot = global.db.settings
		if (typeof setBot !== 'object') global.db.settings = {}
		if (setBot) {
			if (!('anticall' in setBot)) setBot.anticall = false
			if (!('autobio' in setBot)) setBot.autobio = false
			if (!('autoread' in setBot)) setBot.autoread = false
			if (!('autopromosi' in setBot)) setBot.autopromosi = false
			if (!('autotyping' in setBot)) setBot.autotyping = false
			if (!('readsw' in setBot)) setBot.readsw = false
			if (!('owneroffmode' in setBot)) setBot.owneroffmode = false
		} else {
			global.db.settings = {
				anticall: false,
				autobio: false,
				autoread: false,
				autopromosi: false, 
				autotyping: false,
				readsw: false, 
				owneroffmode: false
			}
		}
		
		
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
		
		
		if (m.isGroup) {
			let group = global.db.groups[m.chat]
			if (typeof group !== 'object') global.db.groups[m.chat] = {}
			if (group) {
				if (!('antilink' in group)) group.antilink = false
				if (!('antilink2' in group)) group.antilink2 = false
				if (!('welcome' in group)) group.welcome = false
				if (!('mute' in group)) group.mute = false
				if (!('simi' in group)) group.simi = false
		          if (!('blacklistjpm' in group)) group.blacklistjpm = false
			} else {
				global.db.groups[m.chat] = {
					antilink: false,
					antilink2: false,
					welcome: false, 
					mute: false, 
					simi: false, 
					blacklistjpm: false
				}
			}
		}
	} catch (e) {
		throw e;
	}
}


module.exports = DataBase


let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.cyan("File Update => "), chalk.cyan.bgBlue.bold(`${__filename}`))
delete require.cache[file]
require(file)
})