module.exports = async (zyn, m, store) => {
  try {
    const text = m.body.trim().toLowerCase();

    // Commande : !menu
    if (text === '!menu') {
      const menu = `
╭──🕷️ NO-DARA-MD ──⬣
│ 👋 Bonjour, voici les commandes dispo :
│
│ ✅ !menu - Affiche ce menu
│ ✅ !ping - Vérifie si le bot répond
│ ✅ !creator - Affiche les infos du créateur
│ ✅ !time - Affiche l'heure actuelle
╰────────────────⬣`;
      return m.reply(menu);
    }

    // Commande : !ping
    if (text === '!ping') {
      return m.reply('🟢 Le bot est en ligne et réactif !');
    }

    // Commande : !creator
    if (text === '!creator') {
      return m.reply('👤 Créateur : 🌛 ZEPHYR TSH\n📞 WhatsApp : +50947118426');
    }

    // Commande : !time
    if (text === '!time') {
      const date = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Brazzaville' });
      return m.reply(`🕒 Heure actuelle : ${date}`);
    }

    // Tu peux ajouter d'autres commandes ici
    // Exemple :
    // if (text.startsWith('!echo ')) {
    //   const msg = text.split('!echo ')[1];
    //   return m.reply(msg);
    // }

  } catch (err) {
    console.error("Erreur dans satan.js :", err);
    return m.reply('❌ Une erreur est survenue en traitant la commande.');
  }
};
