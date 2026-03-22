const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildBans,
  ]
});

// ─── Anti-raid : compteur de joins ───
const joinTracker = new Map(); // guildId -> [timestamps]
const RAID_THRESHOLD = 10;     // 10 joins
const RAID_WINDOW    = 10000;  // en 10 secondes

// ─── Anti-spam : compteur de messages ───
const spamTracker = new Map(); // userId -> [timestamps]
const SPAM_THRESHOLD = 7;      // 7 messages
const SPAM_WINDOW    = 5000;   // en 5 secondes

// ─── Logs ───
let logChannelId = null; // sera défini avec !setlog

function sendLog(guild, embed) {
  if (!logChannelId) return;
  const ch = guild.channels.cache.get(logChannelId);
  if (ch) ch.send({ embeds: [embed] });
}

// ─── Bot prêt ───
client.once('ready', () => {
  console.log(`✅ Bot ${client.user.tag} en ligne !`);
  client.user.setActivity('🛡️ Protection du serveur', { type: 3 });
});

// ─── Anti-raid : détection de joins massifs ───
client.on('guildMemberAdd', async (member) => {
  const guildId = member.guild.id;
  const now = Date.now();

  if (!joinTracker.has(guildId)) joinTracker.set(guildId, []);
  const joins = joinTracker.get(guildId).filter(t => now - t < RAID_WINDOW);
  joins.push(now);
  joinTracker.set(guildId, joins);

  if (joins.length >= RAID_THRESHOLD) {
    // Alerte raid détecté
    const embed = new EmbedBuilder()
      .setColor('#FF4F6F')
      .setTitle('🚨 RAID DÉTECTÉ')
      .setDescription(`**${joins.length} membres** ont rejoint en moins de 10 secondes !`)
      .addFields({ name: 'Action', value: 'Vérification manuelle recommandée' })
      .setTimestamp();
    sendLog(member.guild, embed);

    // Ban automatique si compte < 7 jours
    const accountAge = now - member.user.createdTimestamp;
    if (accountAge < 7 * 24 * 60 * 60 * 1000) {
      try {
        await member.ban({ reason: '🚨 Anti-raid : compte trop récent' });
        const banEmbed = new EmbedBuilder()
          .setColor('#FF4F6F')
          .setTitle('🔨 Ban automatique — Anti-raid')
          .setDescription(`**${member.user.tag}** banni (compte < 7 jours)`)
          .setTimestamp();
        sendLog(member.guild, banEmbed);
      } catch (e) {
        console.error('Erreur ban anti-raid:', e.message);
      }
    }
  }

  // Log join normal
  const joinEmbed = new EmbedBuilder()
    .setColor('#4FFFB0')
    .setTitle('✅ Nouveau membre')
    .setDescription(`**${member.user.tag}** a rejoint le serveur`)
    .addFields({ name: 'Compte créé le', value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:R>` })
    .setTimestamp();
  sendLog(member.guild, joinEmbed);
});

// ─── Anti-spam ───
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();

  // Tracker spam
  if (!spamTracker.has(userId)) spamTracker.set(userId, []);
  const msgs = spamTracker.get(userId).filter(t => now - t < SPAM_WINDOW);
  msgs.push(now);
  spamTracker.set(userId, msgs);

  if (msgs.length >= SPAM_THRESHOLD) {
    try {
      await message.member?.timeout(5 * 60 * 1000, '🚫 Anti-spam');
      const spamEmbed = new EmbedBuilder()
        .setColor('#FFB84F')
        .setTitle('⚠️ Spam détecté')
        .setDescription(`**${message.author.tag}** a été mis en timeout 5 minutes`)
        .addFields({ name: 'Salon', value: `<#${message.channelId}>` })
        .setTimestamp();
      sendLog(message.guild, spamEmbed);
      spamTracker.set(userId, []);
    } catch (e) {
      console.error('Erreur timeout spam:', e.message);
    }
    return;
  }

  // ─── Commandes ───
  const prefix = process.env.PREFIX || '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const isAdmin = message.member?.permissions.has(PermissionsBitField.Flags.Administrator);

  // !help
  if (command === 'help') {
    const embed = new EmbedBuilder()
      .setColor('#7C6FFF')
      .setTitle('🤖 nathanfr3 — Commandes')
      .addFields(
        { name: '🛡️ Modération', value: '`!ban @user` `!kick @user` `!timeout @user` `!unban id`' },
        { name: '📋 Logs', value: '`!setlog #salon` — définit le salon de logs' },
        { name: '📊 Info', value: '`!serverinfo` `!userinfo @user` `!ping`' },
        { name: '🧹 Nettoyage', value: '`!clear 10` — supprime N messages' },
      )
      .setFooter({ text: 'nathanfr3 • Protection du serveur' })
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // !ping
  if (command === 'ping') {
    return message.reply(`🏓 Pong ! Latence : **${client.ws.ping}ms**`);
  }

  // !setlog
  if (command === 'setlog' && isAdmin) {
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('❌ Mentionnez un salon : `!setlog #logs`');
    logChannelId = channel.id;
    return message.reply(`✅ Salon de logs défini sur <#${channel.id}>`);
  }

  // !ban
  if (command === 'ban' && isAdmin) {
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Mentionnez un membre : `!ban @user raison`');
    const reason = args.slice(1).join(' ') || 'Aucune raison';
    try {
      await target.ban({ reason });
      const embed = new EmbedBuilder().setColor('#FF4F6F').setTitle('🔨 Membre banni')
        .setDescription(`**${target.user.tag}** banni par **${message.author.tag}**`)
        .addFields({ name: 'Raison', value: reason }).setTimestamp();
      sendLog(message.guild, embed);
      message.reply({ embeds: [embed] });
    } catch (e) { message.reply('❌ Impossible de bannir ce membre.'); }
    return;
  }

  // !kick
  if (command === 'kick' && isAdmin) {
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Mentionnez un membre : `!kick @user`');
    const reason = args.slice(1).join(' ') || 'Aucune raison';
    try {
      await target.kick(reason);
      const embed = new EmbedBuilder().setColor('#FFB84F').setTitle('👢 Membre expulsé')
        .setDescription(`**${target.user.tag}** expulsé par **${message.author.tag}**`)
        .addFields({ name: 'Raison', value: reason }).setTimestamp();
      sendLog(message.guild, embed);
      message.reply({ embeds: [embed] });
    } catch (e) { message.reply('❌ Impossible d\'expulser ce membre.'); }
    return;
  }

  // !clear
  if (command === 'clear' && isAdmin) {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.reply('❌ Nombre entre 1 et 100 : `!clear 10`');
    await message.channel.bulkDelete(amount + 1, true);
    const msg = await message.channel.send(`✅ **${amount}** messages supprimés.`);
    setTimeout(() => msg.delete().catch(() => {}), 3000);
    return;
  }

  // !serverinfo
  if (command === 'serverinfo') {
    const g = message.guild;
    const embed = new EmbedBuilder().setColor('#7C6FFF').setTitle(`📊 ${g.name}`)
      .addFields(
        { name: 'Membres', value: `${g.memberCount}`, inline: true },
        { name: 'Salons', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Rôles', value: `${g.roles.cache.size}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(g.createdTimestamp/1000)}:R>`, inline: true },
      ).setThumbnail(g.iconURL()).setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // !userinfo
  if (command === 'userinfo') {
    const target = message.mentions.members.first() || message.member;
    const embed = new EmbedBuilder().setColor('#7C6FFF').setTitle(`👤 ${target.user.tag}`)
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Rejoint le', value: `<t:${Math.floor(target.joinedTimestamp/1000)}:R>`, inline: true },
        { name: 'Compte créé', value: `<t:${Math.floor(target.user.createdTimestamp/1000)}:R>`, inline: true },
      ).setThumbnail(target.user.displayAvatarURL()).setTimestamp();
    return message.reply({ embeds: [embed] });
  }
});

// ─── Log départ membre ───
client.on('guildMemberRemove', (member) => {
  const embed = new EmbedBuilder()
    .setColor('#FF4F6F')
    .setTitle('👋 Membre parti')
    .setDescription(`**${member.user.tag}** a quitté le serveur`)
    .setTimestamp();
  sendLog(member.guild, embed);
});

// ─── Démarrage ───
client.login(process.env.DISCORD_TOKEN);
