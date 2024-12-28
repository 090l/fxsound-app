const { Permissions, Intents, Client, MessageEmbed, MessageAttachment, Collection, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient,additionalEmbed} = require('discord.js');
require('events').EventEmitter.defaultMaxListeners = 200;
const express = require('express');

const emco = '#ffffff';
let useEmbeds = true;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  partials: ['CHANNEL', 'MESSAGE', 'USER', 'GUILD_MEMBER'],
  allowedMentions: {
    parse: ['users'],
    repliedUser: false
  }
});

const ms = require("ms");
const fs = require('fs');
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { DisTube, DisTubeStream } = require("distube");
const config = require('./config.json');
const { owners, prefix } = require(`${process.cwd()}/config`);
const fetch = require("node-fetch");
client.prefix = prefix;
module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require(`${process.cwd()}/config`);
require("./handler")(client);
const tempData = new Collection();
tempData.set("bots", []);

setTimeout(async () => {
  var data = fs.readFileSync('./tokens.json');
  var parsedData = JSON.parse(data);
  var tokens_data = parsedData;
  if (!tokens_data[0]) return;

  tokens_data.forEach(token => {
    runBotSystem(token.token);
  });
}, 3000);

async function convert(harinder) {
  try {
    const temperance = await fetch(harinder);
    const myrtte = temperance.url;
    if (myrtte) {
      return `${""}${myrtte}${""}`;
    } else {
      return null;
    }
  } catch (deari) {
    return 0;
  }
}


async function runBotSystem(token) {
  const client83883 = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER'],
    allowedMentions: {
      parse: ['users'],
      repliedUser: false
    }
  });
 


  client83883.music = new DisTube(client83883, {
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true,
      }),
      new SoundCloudPlugin(),
    ],
    youtubeDL: false
  });

  const skipButton = new MessageButton()
  .setCustomId('skipButton')
  .setEmoji("<:skip:1254339665314447391>")
  .setStyle('SECONDARY');
const volumeUpButton = new MessageButton()
  .setCustomId('volumeUpButton')
  .setEmoji("<:volumeup:1203675265390219334>")
  .setStyle('SECONDARY');
const stopButton = new MessageButton()
  .setCustomId('pauseButton')
  .setEmoji("<:pause:1230358263741157418>")  // تغيير الإيموجي للإشارة للإيقاف المؤقت
  .setStyle('SECONDARY');
const volumeDownButton = new MessageButton()
  .setCustomId('volumeDownButton')
  .setEmoji("<:volumedo:1203675261699358790>")
  .setStyle('SECONDARY');
const repeatButton = new MessageButton()
  .setCustomId('repeatButton')
  .setEmoji("<:reload:1223957541038460978>")
  .setStyle('SECONDARY');
const row = new MessageActionRow()


  .addComponents(repeatButton, volumeDownButton, stopButton, volumeUpButton, skipButton);



  
  client83883.lastVolume = 50;
  client83883.music
  .on('playSong', (queue, song) => {
    if (useEmbeds) {
      const embed = new MessageEmbed()
      .setAuthor({name:"🎵 Playing song"})
      .setColor(emco) 
      .addFields(
        { name: 'Song Name', value: `***Started:* [${song.name}](${song.url})**` },
        { name: 'Song Duration', value: `(\`${song.formattedDuration}\`)` }
      )
      .setThumbnail("https://f.top4top.io/p_3112sarjk1.png")     
      .setFooter({text:client83883.user.username, iconURL:client83883.user.displayAvatarURL()})
      song.metadata.msg.edit({ embeds: [embed], components: [row] }).catch(() => 0);
      
    } else {
      song.metadata.msg.edit({
        content: `*ϟ Playing song* : **${song.name}** *Time:* **${song.formattedDuration}**.`,
        components: [row]
      }).catch(() => 0);
      
    }
    if (queue?.volume !== client83883.lastVolume) {
      queue.setVolume(client83883.lastVolume);
    };
  })
  .on('addSong', (queue, song) => {
    if (useEmbeds) {
      const embed = new MessageEmbed()
        .setAuthor({name:"ϟ Adding to queue"})
        .setColor(emco) 
        .addFields(
          { name: 'Song Name', value: `**${song.name}**` },
          { name: 'Song Duration', value: `(\`${song.formattedDuration}\`)` }
        )
        .setThumbnail("https://k.top4top.io/p_31127exa81.png ")     
        .setFooter({text:client83883.user.username, iconURL:client83883.user.displayAvatarURL()})
      song.metadata.msg.edit({ embeds: [embed] }).catch(() => 0);
    } else {
      song.metadata.msg.edit({
        content: `*ϟ Add song* : **${song.name}** *Time:* **${song.formattedDuration}**.`,
        components: [row]
      }).catch(() => 0);
    }
  })
  .on('addList', (queue, playlist) => {
    if (useEmbeds) {
      const embed = new MessageEmbed()
      .setColor(emco) 
        .setDescription(`🔂 **أُضيفت قائمة الآغاني** *${playlist.name}* (\`${playlist.songs.length}\` آغنية) **إلى طابور الأغاني**`);
      song.metadata.msg.edit({ embeds: [embed] }).catch(() => 0);
    } else {
      song.metadata.msg.edit(`🔂 **أُضيفت قائمة الآغاني** *${playlist.name}* (\`${playlist.songs.length}\` آغنية) **إلى طابور الأغاني**`).catch(() => 0);
    }
  })
  .on('error', (channel, e) => {
    console.log(e);
    if (channel) {
      if (useEmbeds) {
        const embed = new MessageEmbed()
        .setColor(emco) 
          .setDescription(` **تم إستقبال خطأ:** ${e.toString().slice(0, 1974)}`);
        channel.send({ embeds: [embed] }).catch(() => 0);
      } else {
        channel.send(` **تم إستقبال خطأ:** ${e.toString().slice(0, 1974)}`).catch(() => 0);
      }
    } else {
      console.error(e);
    }
  })
  .on('searchNoResult', (message, query) => {
    if (useEmbeds) {
      const embed = new MessageEmbed()
      .setColor(emco) 
        .setDescription(`>  **لم يتم إيجاد نتائج بحث لـ** *${query}*`);
      message.reply({ embeds: [embed] }).catch(() => 0);
    } else {
      message.reply(`>  **لم يتم إيجاد نتائج بحث لـ** *${query}*`).catch(() => 0);
    }
  });

  client83883.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
  
    const queue = client83883.music.getQueue(interaction.guildId);
  
    if (!queue) {
      await interaction.reply({ content: '***There is no song currently playing.***', ephemeral: true });
      return;
    }
  

    
    switch (interaction.customId) {
      case 'repeatButton':
        if (queue.repeatMode === 0) {
          queue.setRepeatMode(1);
          await interaction.reply({ content: '*ϟ Loop mode is* **ON**', ephemeral: true });
        } else if (queue.repeatMode === 1) {
          queue.setRepeatMode(0);
          await interaction.reply({ content: '*ϟ Loop mode is* **OFF**', ephemeral: true });
        }  
        break;
    
      case 'volumeDownButton':
        const newVolumeDown = queue.volume - 10;
        if (newVolumeDown >= 0) {
          queue.setVolume(newVolumeDown); // خفض مستوى الصوت بـ 10 درجات
          await interaction.reply({ content: `***ϟ Volume changed from \`${queue.volume}%\` .***`, ephemeral: true });
        } else {
          await interaction.reply({ content: '***Volume cannot be set below 0%.***', ephemeral: true });
        }
        break;
    
      case 'pauseButton':
        if (queue.paused) {
          queue.resume();
          await interaction.reply({ content: '***song has resumed.***', ephemeral: true });
        } else {
          queue.pause();
          await interaction.reply({ content: '***song has been paused.***', ephemeral: true });
        }
        break;
    
      case 'volumeUpButton':
        const newVolumeUp = queue.volume + 10;
        if (newVolumeUp <= 150) {
          queue.setVolume(newVolumeUp);
          await interaction.reply({ content: `***volume has been raised to \`${queue.volume}%\` .***`, ephemeral: true });
        } else {
          queue.setVolume(150);
          await interaction.reply({ content: `***volume is raised to maximum by 150%.***`, ephemeral: true });
        }
        break;
    
      case 'skipButton':
        if (queue.songs.length <= 1) {
          await interaction.reply({ content: '*Server queue is empty.*', ephemeral: true });
          return;
        }
        queue.skip();
        await interaction.reply({ content: '***ϟ Skipped the current song.***', ephemeral: true });
        break;
    
      default:
        await interaction.reply({ content: 'الزر غير معرف.', ephemeral: true });
        break;
    }
  });
  







  client83883.on('ready', async () => {
    let newData = tempData.get("bots");
    newData.push(client83883);
    tempData.set(`bots`, newData);

    let botNumber = newData.indexOf(client83883) + 1;
    console.log(`🎶 ${botNumber} > ${client83883.user.username} : ${client83883.guilds.cache.first()?.name}`);

    let int = setInterval(async () => {
        var data = fs.readFileSync('./tokens.json', 'utf8');
        if (!data || data == '') return;
        data = JSON.parse(data);
        tokenObj = data.find((tokenBot) => tokenBot.token == token);
        if (!tokenObj) {
            client83883.destroy()?.catch(() => 0);
            return clearInterval(int);
        };

        let serverID = tokenObj.Server; // استخراج الـ ID للسيرفر من ملف التوكنات

        if (tokenObj.channel) {
            let guild = client83883.guilds.cache.get(serverID);
            if (guild) {
                let voiceChannel = guild?.me.voice.channel;
                if (!voiceChannel) {
                    let musicChannel = guild.channels.cache.get(tokenObj?.channel);
                    if (musicChannel && musicChannel.joinable) {
                        client83883.music.voices.join(musicChannel).catch(() => 0);
                    }
                }
                if (voiceChannel && voiceChannel.id !== tokenObj.channel) {
                    let musicChannel = guild.channels.cache.get(tokenObj?.channel);
                    if (musicChannel && musicChannel.joinable) {
                        client83883.music.voices.join(musicChannel).catch(() => 0);
                    }
                }
            }
        } else {
            let guild = client83883.guilds.cache.get(serverID);
            if (guild) {
                let voiceChannel = guild?.me.voice.channel;
                if (voiceChannel) {
                    client83883.music.voices.leave(guild.id);
                }
            }
        }
    }, 5000);
});



client83883.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  var data = fs.readFileSync('./tokens.json', 'utf8');
  if (data == '' || !data) return;
  data = JSON.parse(data);
  let tokenObj = data.find((t) => t.token == token);
  if (!data || !tokenObj) return;
  
  let args = message.content?.trim().split(' ');
  if (args) {
      if (args[0] == `<@!${client83883.user.id}>` || args[0] == `<@${client83883.user.id}>`) {
          args = args.slice(1);
          if (!args[0]) return;
          if (args[0] == 'help') {
            const botOwnerId = tokenObj.client; // استخراج الأيدي من ملف التوكنات
            const button1 = new MessageButton()
            .setLabel('Support')
            .setEmoji("1296065986151059496")
            .setStyle('LINK')
            .setURL('https://discord.gg/HbTsKEQR9N');
        
          const row1 = new MessageActionRow().addComponents(button1);
        
          const helpEmbed = new MessageEmbed()
          .setAuthor('Voga.', client83883.user.displayAvatarURL({ dynamic: true }))
          .setColor(emco) 
          
          .setThumbnail("https://cdn.discordapp.com/attachments/1304122662750130248/1304794675600949350/em_5.png?ex=6730b03c&is=672f5ebc&hm=ce05244db9966053f4965e3334a805a3b8260b6f956cfdfb3aed7991c9980977&")
          .setTitle('*Music Commands :*')

          .setDescription(`
                \`play\` : Play Song from YouTube, SoundCloud, or Spotify
                \`stop\` : Stop The Music - إيقاف الأغاني
                \`skip\` : Skip The Current Song - تخطي الأغنية الحالية
                \`volume\` : Set The Music Volume - ضبط مستوى صوت الأغاني
                \`nowplaying\`:Show The Song Playing Now - عرض الأغنية التي يتم تشغيلها
                \`loop\` : Loop The Queue - تكرار قائمة الأغاني
                \`pause\` : Pause The Server Queue - إيقاف قائمة الانتظار مؤقتًا
                \`resume\` : Resume The Music - استئناف الأغاني
                \`seek\` : Seek The Song  - البحث عن الأغنية 
                \`forward\` : Skip The Specified Path - تخطي المسار المحدد
                \`autoplay\` : Autoplay Mode For Songs - وضع التشغيل التلقائي للأغاني
                **OWNERS COMMANDS:**
                \`join\` : Set Bot Channel Enable 24/7 - إدخال البوت إلى الروم
                \`setup\` : Install Bot With Voice Change name - تثبيت البوت في روم واسمه
                \`leave\` : Leave From Channel Disable 24/7 - إخراج البوت من الروم
                \`setchat\`: Set Commands Chat - تعيين الأوامر للدردشة
                \`unchat\`: Unset Commands Chat - إلغاء تعيين الأوامر للدردشة
                \`setprefix\`: Set A Prefix For The Bot - تعيين بادئة للبوت
                \`setting\` : Display Bot Settings - عرض إعدادات البوت
                \`ping\` : Show Bot Response Speed - إظهار سرعة استجابة البوت
                \`restart\` : Restart The Bot - إعادة تشغيل البوت
                \`setavatar\` : Change Bot Avatar - تغيير صورة البوت
                \`setname\` : Change Bot Name - تغيير اسم البوت
                \`setstreaming\` : Change The Bot's State - تغيير حالة البوت
           `)


  
          
            .setFooter('If you have any problem contact with: lane .');
        
            

          message.author.send({
            embeds: [helpEmbed],
            components: [row1],
          }).then(async () => {
            message.react("✅").catch(() => 0);
          }).catch(() => {
            message.react("🔒").catch(() => 0);
          });
        }


        if (!owners.includes(message.author.id) && !message.member.permissions.has('ADMINISTRATOR')) {
          return;
        }     
             if(args[0] == 'restart' || args[0] == 'اعاده') {
             await client83883.destroy()
             setTimeout(async() => {
               client83883.login(token).then(() => {
                 message.react(`💹`).catch(() => 0)
             }).catch(() => { console.log(`${client83883.user.tag} (${client83883.user.id}) has an error with restarting.`) })
           }, 5000)
              
           } else if (args[0] == 'setname' || args[0] == 'اسم'|| args[0] == 'name' || args[0] == 'sn') {
            let name = args.slice(1).join(' ');
            if (!name) return;
        
            const tryChangeName = (newName, attempts = 0) => {
                client83883.user.setUsername(newName).then(async () => {
                    message.react('✅').catch(() => 0);
                }).catch((error) => {
                    if (error.code === 50035) { // الإسم مُستخدم كثيرًأ
                        if (attempts < 3) { // تحديد عدد المحاولات المسموح بها
                            const newNameWithDot = `${newName}.`; // إضافة نقطة إلى الإسم
                            tryChangeName(newNameWithDot, attempts + 1); // المحاولة مرة أخرى مع الإسم المُعدل
                        } else {
                            message.react('⏳').catch(() => 0); // تفاعل خطأ عند الوصول للحد الأقصى للمحاولات
                        }
                    } else {
                        console.error(error);
                        message.reply("An error occurred while changing the bot's name.");
                    }
                });
            };
        
            tryChangeName(name); // بدء المحاولة لتغيير الإسم
  
           } else if (args[0] == 'setup') {
            let channel = message.member.voice.channel;
            if (!channel) return;
          
            data = data.map((tokenBot) => {
              if (tokenBot.token == token) {
                tokenBot.channel = channel.id;
              }
              return tokenBot;
            });
          
            // تغيير اسم البوت نفسه
            const cooldownTime = 5000; // تعيين فترة الانتظار بالمللي ثانية (5 ثوانٍ)
            const lastChangeTime = client83883.user.lastChangeTime || 0;
            const currentTime = Date.now();
          
            // إذا مضت فترة زمنية أقل من cooldownTime من آخر مرة تم فيها تغيير الاسم
            if (currentTime - lastChangeTime < cooldownTime) {
              return message.react('✅');
            }
          
            try {
              await client83883.user.setUsername(channel.name);
              // تحديث وقت آخر تغيير
              client83883.user.lastChangeTime = Date.now();
              fs.writeFile('./tokens.json', JSON.stringify(data, null, 2), (err) => {
                if (err) throw err;
              });
              message.react('✅');
            } catch (error) {
              if (error.code === 50035) {
                // يتم إعادة المحاولة في حالة حدوث خطأ 50035
                return message.react('❌');
              } else {
                console.error(error);
              }
            }
            
        } else if (args[0] == 'setavatar' || args[0] == 'صورة' || args[0] == 'avatar' || args[0] == 'avatar' || args[0] == 'sa') {
            let url = args[1];
            if (!url && !message.attachments.first()) return;
          
            if (message.attachments.first()) {
              url = message.attachments.first().url;
            }
          
            client83883.user.setAvatar(url)
              .then(() => {
                message.react('✅').catch(() => {});
              })
              .catch((error) => {
                message.react('✅').catch(() => {});
              });
                    
           } else if (args[0] == 'join' || args[0] == 'leave' || args[0] == 'setchannel' || args[0] == 'come' || args[0] == 'تعال' || args[0] == 'ادخل'|| args[0] == 'اخرج'|| args[0] == 'اطلع'|| args[0] == 'disablechannel' ) {
            let data = fs.readFileSync('./tokens.json');
            data = JSON.parse(data);
            tokenObj = data.find((tokenBot) => tokenBot.token == token);
            let channel;
            if (args[0] == 'join' || args[0] == 'come' || args[0] == 'setvc' || args[0] == 'ادخل' || args[0] == 'تعال')  {
              channel = message.member.voice.channel;
              if (!channel) return;
            } else {
              channel = await message.guild.channels.fetch(args[1]).catch(() => 0);
              if (!channel) return;
            }
            data = data.map((tokenBot) => {
              if (tokenBot.token == token) {
                tokenBot.channel = channel.id;
              }
              return tokenBot;
            });
            
            fs.writeFile('./tokens.json', JSON.stringify(data, null, 2), (err) => {
              if (err) throw err;
            });
            message.react('✅');
          } else if (args[0] == 'setchat' || args[0] == 'chat' || args[0] == 'settc' || args[0] == 'اوامر') {
            let data = fs.readFileSync('./tokens.json', 'utf8');
            let parsedData = JSON.parse(data);
            
            tokenObj = parsedData.find((tokenBot) => tokenBot.token == token);
            
            if (!tokenObj) return;
            
            let channel = message.guild.channels.cache.get(message.channel.id); // Get the channel where the command was executed
            
            if (!channel) return;
            
            parsedData = parsedData.map((tokenBot) => {
                if (tokenBot.token == token) {
                    tokenBot.chat = channel.id; // Set the channel ID as the chat channel
                }
                return tokenBot;
            });
            
            fs.writeFile('./tokens.json', JSON.stringify(parsedData, null, 2), (err) => {
                if (err) throw err;
                message.react('✅');
            });        
          
          } else if (args[0] == 'unchat' || args[0] == 'unt' || args[0] == 'الغاء') {
            let data = fs.readFileSync('./tokens.json', 'utf8');
            let parsedData = JSON.parse(data);
            
            tokenObj = parsedData.find((tokenBot) => tokenBot.token == token);
            
            if (!tokenObj) return;
            
            let channelId = tokenObj.chat;
            if (!channelId) return message.reply('**لا يوجد شات مُحدد.**');
                
            parsedData = parsedData.map((tokenBot) => {
                if (tokenBot.token == token) {
                    delete tokenBot.chat; // Remove the chat ID
                }
                return tokenBot;
            });
            
            fs.writeFile('./tokens.json', JSON.stringify(parsedData, null, 2), (err) => {
                if (err) throw err;
                message.react('✅');
            });
            loadPrefix();

        } else if (args[0] == 'ping' || args[0] == 'بنج' || args[0] == 'بنغ') {
            const ping = client.ws.ping;
            message.reply(`***ϟ Pong! My ping is ${ping}ms.***`);
            
          }else if (args[0] === 'setting' || args[0] == 'st' || args[0] == 'اعدادات' || args[0] == 'معلومات' || args[0] == 'settings') {
            let voiceChannel = message.guild.channels.cache.get(tokenObj.channel);
            let commandChat = message.guild.channels.cache.get(tokenObj.chat);
                        const embed = new MessageEmbed()
              .setThumbnail(client83883.user.displayAvatarURL({ dynamic: true }))
              .setColor(emco) 
              .setDescription(`
                **Platform :** \`YouTube\`
                **Voice Channel :** ${voiceChannel ? `<#${voiceChannel.id}>` : '`Not set`'}
                **Text Channel :** ${commandChat ? `<#${commandChat.id}>` : '`Not set`'}
                **Play In Voice Channel :** \`Disable\`
                **Number of Servers the Bot is in :** \`${client83883.guilds.cache.size}\`
              `);
            
            message.reply({ embeds: [embed] });

          } else if (args[0] == 'setstreaming' || args[0] == 'streaming' || args[0] == 'ste' || args[0] == 'ستريمنج') {
            let status = message.content.split(" ")[2];
            if (!status) return message.react("❌");
            client83883.user.setPresence({
              activities: [
                {
                  name: status,
                  type: 'STREAMING',
                  url: "https://twitch.tv/" + status,
                },
              ],
              status: 'online',
            });
            message.react("✅");
          
            // Save the new status in the token file
            let tokens = fs.readFileSync('./tokens.json');
            tokens = JSON.parse(tokens);
            let tokenObj = tokens.find((tokenBot) => tokenBot.token == token);
            tokenObj.status = status;
            fs.writeFileSync('./tokens.json', JSON.stringify(tokens, null, 2));
          } else if (args[0] == 'setprefix') {
            if (!args[1]) return message.reply('يرجى تحديد البادئة الجديدة للبوت.');
  
            let newPrefix = args[1];  
            
            let data = fs.readFileSync('./tokens.json', 'utf8');
            let parsedData = JSON.parse(data);
            let tokenObj = parsedData.find((tokenBot) => tokenBot.token === token);
            if (tokenObj) {
                tokenObj.prefix = newPrefix;  
            } else {
                parsedData.push({ token, prefix: newPrefix });  
            }
            fs.writeFileSync('./tokens.json', JSON.stringify(parsedData, null, 2));
            
            message.reply(`**تم تحديث بادئه إلي : \`${newPrefix}\`**`);

        } else if (args[0] == 'addrole') {
          if (!message.mentions.roles.size) {
              return message.reply('يرجى منشن الرول لتحديد الإيدي.');
          }
      
          const role = message.mentions.roles.first();
          const roleId = role.id;
      
          let data = fs.readFileSync('./tokens.json', 'utf8');
          let parsedData = JSON.parse(data);
          
          tokenObj = parsedData.find((tokenBot) => tokenBot.token == token);
          
          if (!tokenObj) return;
          
          // حفظ أيدي الرول مع التوكن
          parsedData = parsedData.map((tokenBot) => {
              if (tokenBot.token == token) {
                  tokenBot.Admin = roleId;
              }
              return tokenBot;
          });
          
          fs.writeFile('./tokens.json', JSON.stringify(parsedData, null, 2), (err) => {
              if (err) throw err;
              message.react('✅');
          });
      }
      
          
        }
      }
    });

    


    client83883.on("ready", () => {
      // تحديد وظيفة للشيك على حالة التوكنات كل 10 ثوانٍ
      setInterval(() => {
        fs.readFile('./tokens.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const tokens = JSON.parse(data);
          tokens.forEach((token) => {
            // إذا كان هناك حالة محددة للتوكن الحالي، قم بتعيين حالة البوت بناءً عليها
            if (token.status && token.token === client83883.token) {
              client83883.user.setPresence({
                activities: [
                  {
                    name: token.status,
                    type: 'STREAMING',
                    url: "https://twitch.tv/" + token.status,
                  },
                ],
                status: 'online',
              });
            }
          });
        });
      }, 10000); // الشيك كل 10 ثوانٍ
    });
    
    

  
// -----------------------------------------------------------

client83883.on("ready", () => { client83883.user.setPresence({ status: 'dnd', activities: [{ name: ``, type: "STREAMING", url: "https://m.twitch.tv/"}]})})



client83883.on('guildCreate', async (guild) => {
  let tokens = [];
  try {
    const tokensData = fs.readFileSync('./tokens.json', 'utf8');
    tokens = JSON.parse(tokensData);
  } catch (error) {
    console.error('Error reading tokens.json:', error);
    return;
  }

  const guildId = guild.id;
  const botName = client83883.user.tag; // اسم البوت
  if (!tokens.some(token => token.Server === guildId)) {
    await guild.leave();
    console.log(`\x1b[31m > left server ${botName} : ${guild.name}\x1b[0m`);
  } else {
    console.log(`\x1b[32m✅ > joined server ${botName} : ${guild.name}\x1b[0m`);
  }
});


// -----------------------------------------------------------
client83883.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  let member_voice = message.member?.voice?.channel
  if (!member_voice) return;
  let client_voice = message.guild.me?.voice?.channel
  if (!client_voice) return;
  if (member_voice.id !== client_voice.id) return;
  var data = fs.readFileSync('./tokens.json', 'utf8');
  if (!data || data == '') return;
  data = JSON.parse(data);
  if (!data) return;
  data = data.find((tok) => tok.token == token);
  if (!data) return;
  if (data?.chat && data?.chat !== message.channel.id) return;
  var data = fs.readFileSync('./tokens.json', 'utf8');
  if (!data || data == '') return;
  data = JSON.parse(data);
  if (!data) return;
  let botData = data.find((tok) => tok.token == token);
  if (!botData) return;
  let prefix = botData.prefix || "";
      let cmdsArray = {
      play: [`${prefix}شغل`, `${prefix}ش`, `${prefix}p`, `${prefix}play`, `${prefix}P`, `${prefix}Play`],
      stop: [`${prefix}stop`, `${prefix}وقف`, `${prefix}Stop`, `${prefix}توقيف`],
      skip: [`${prefix}skip`, `${prefix}سكب`, `${prefix}تخطي`, `${prefix}s`, `${prefix}س`, `${prefix}S`, `${prefix}Skip`],
      volume: [`${prefix}volume`, `${prefix}vol`, `${prefix}صوت`, `${prefix}v`, `${prefix}ص`,`${prefix}V`,`${prefix}Vol`,`${prefix}Volume`],
      nowplaying: [`${prefix}nowplaying`, `${prefix}np`,`${prefix}Np`,`${prefix}Nowplaying`,`${prefix}الشغال`,`${prefix}الان`],
      loop: [`${prefix}loop`, `${prefix}تكرار`, `${prefix}l`,`${prefix}L`,`${prefix}Loop`],
      pause: [`${prefix}pause`, `${prefix}توقيف`, `${prefix}كمل`, `${prefix}pa`,`${prefix}Pa`,`${prefix}Pause`],
      seek: [`${prefix}seek`,`${prefix}Seek`,`${prefix}قدم`,`${prefix}se`,`${prefix}Se`],
      forward: [`${prefix}forward`,`${prefix}Forward`,`${prefix}تقديم`,`${prefix}fo`,`${prefix}Fo`],
      autoplay: [`${prefix}autoplay`,`${prefix}Autoplay`,`${prefix}Ap`,`${prefix}ap`],
      queue: [`${prefix}queue`, `${prefix}قائمة`, `${prefix}اغاني`, `${prefix}q`, `${prefix}qu`,`${prefix}Q`,`${prefix}Qu`,`${prefix}Queue`],
  };
  
    if (cmdsArray.play.some((cmd) => message.content.split(' ')[0] == cmd)) {
      let song = message.content.split(' ').slice(1).join(' ')
      if (song) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setColor(emco) 
            .setDescription(`***ϟ Starting Playing.....***`);
          message.reply({ embeds: [embed] }).then(async (msg) => {
            await client83883.music.play(message.member.voice.channel, String(await convert(song) || song), {
              member: message.member,
              textChannel: message.channel,
              metadata: { msg },
              message
            });
          }).catch(() => 0)
        } else {
          message.reply(`*ϟ **Waiting Starting Playing....***`).then(async (msg) => {
            await client83883.music.play(message.member.voice.channel, String(await convert(song) || song), {
              member: message.member,
              textChannel: message.channel,
              metadata: { msg },
              message
            });
          }).catch(() => 0)
        }
      } else {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setAuthor("Play command usage:")
            .setDescription(`***\`play [ title ]\` :** plays first result from **YouTube***.\n***\`play [URL]\` :** searches **YouTube, Spotify**, **SoundCloud***.`)
            .setColor(emco)
            .setThumbnail("https://g.top4top.io/p_31126okkn1.png");
          message.reply({ embeds: [embed] }).catch(() => 0);
        } else {
          message.reply(`*Play command usage:*\n***play [ title ] :** plays first result from **YouTube***.\n***play [URL]:** searches **YouTube, Spotify**, **SoundCloud***.`).catch(() => 0);
        }
      }
    } else if (cmdsArray.stop.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
            .setDescription(`**🎶 There must be music playing to use that!**`)
            .setColor(emco) 
            .setThumbnail("https://g.top4top.io/p_31126okkn1.png&")     
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`🎶 There must be music playing to use that!`).catch(() => 0);
        }
      } else {
        queue.stop();
      }
      
      if (useEmbeds) {
        const embed = new MessageEmbed()
          .setDescription("**ϟ Songs Has Been :** ***Stopped***")
          .setColor(emco) 
          .setThumbnail("https://b.top4top.io/p_3112qelzu1.png");  
        message.reply({ embeds: [embed] }).catch(() => 0);
      } else {
        message.reply("**ϟ Songs Has Been :** ***Stopped***").catch(() => 0);
      }
    } else if (cmdsArray.loop.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setDescription(`**🎶 There must be music playing to use that!**`)
          .setThumbnail("https://g.top4top.io/p_31126okkn1.png")    
          .setColor(emco)
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`🎶 There must be music playing to use that!`).catch(() => 0);
        }
      } else {
        const autoplay = queue.setRepeatMode(queue.repeatMode == 1 ? 0 : 1);
        if (useEmbeds) {
          const embed = new MessageEmbed()
            .setDescription(`**ϟ Loop mode is I** ${autoplay == 1 ? "***ON ..***" : "***OFF ..***"}`)
            .setThumbnail("https://n9.cl/jvbma")
            .setColor(emco)  
          message.reply({ embeds: [embed] }).catch(() => 0);
        } else {
          message.reply(`**ϟ Loop mode is I** ${autoplay == 1 ? "***ON ..***" : "***OFF ..***"}`).catch(() => 0);
        }
      }
      
    } else if (cmdsArray.pause.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setDescription(`**🎶 There must be music playing to use that!**`)
          .setColor(emco) 
          .setThumbnail("https://g.top4top.io/p_31126okkn1.png")     
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`🎶 There must be music playing to use that!`).catch(() => 0);
        }
      } else {
        if (queue.paused) {
          queue.resume();
          message.react("▶️").catch(() => 0);
        } else {
          queue.pause();
          message.react("⏸️").catch(() => 0);
        }
      }    
    } else if (cmdsArray.nowplaying.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setDescription(`**🎶 There must be music playing to use that!**`)
          .setColor(emco)  
          .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169712150130995220/no.png?ex=65566654&is=6543f154&hm=b95ef265828fafc88f4adc56d7ba9f07d44557c4ce8796c790313d889040eafb&")     
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`🎶 There must be music playing to use that!`).catch(() => 0);
        }
      } else {
        const song = queue.songs[0];
        const embed = new MessageEmbed()
          .setTitle(`ϟ Now Playing ..`)
          .setColor(emco) 
          .setDescription(`**[${song.name}](${song.url})**`)
          .setThumbnail(song.thumbnail)
          .setFooter(message.author.username, message.author.avatarURL());
        message.channel.send({ embeds: [embed] }).catch(() => 0);
      }    
    } else if (cmdsArray.volume.some((cmd) => message.content.split(' ')[0] == cmd)) {
  const args = message.content.split(' ');
  const queue = client83883.music.getQueue(message);
  if (!queue) {
    if (useEmbeds) {
      const embed = new MessageEmbed()
      .setDescription(`**🎶 There must be music playing to use that!**`)
      .setColor(emco) 
      .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169712150130995220/no.png?ex=65566654&is=6543f154&hm=b95ef265828fafc88f4adc56d7ba9f07d44557c4ce8796c790313d889040eafb&")     
      message.reply({ embeds: [embed] }).catch(() => 0);
    } else {
      message.reply(`🎶 There must be music playing to use that!`).catch(() => 0);
    }
  } else {
    if (!args[1]) {
      if (useEmbeds) {
        const embed = new MessageEmbed()
          .setDescription(`***ϟ Volume is :  \`${queue?.volume}\`*** `)
          .setColor(emco) 
          .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1170057890506223647/4f4b99efc0371.png?ex=6557a853&is=65453353&hm=40e45c153b144474c1ca95c2854f3f21933cc20c1d2abc1f0ec1e8945da812ea&")    
        message.reply({ embeds: [embed] }).catch(() => 0);
      } else {
        message.reply(`*ϟ Volume is I  \`${queue?.volume}\`*`).catch(() => 0);
      }
    } else {
      const volume = parseInt(args[1]);
      if (isNaN(volume) || volume > 150 || volume < 0) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
            .setDescription(`🚫 Volume must be a valid integer between 0 and 150!`)
            .setColor(emco) 
            .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169712150130995220/no.png?ex=65566654&is=6543f154&hm=b95ef265828fafc88f4adc56d7ba9f07d44557c4ce8796c790313d889040eafb&")   
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`🚫 Volume must be a valid integer between 0 and 150!`).catch(() => 0);
        }
      } else {
        client83883.lastVolume = volume;
        queue.setVolume(volume);
        if (useEmbeds) {
          const embed = new MessageEmbed()
            .setDescription(`***ϟ Volume changed from \`${volume}%\` .***`)
            .setColor(emco) 
            .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1170057890506223647/4f4b99efc0371.png?ex=6557a853&is=65453353&hm=40e45c153b144474c1ca95c2854f3f21933cc20c1d2abc1f0ec1e8945da812ea&");   
          message.reply({ embeds: [embed] }).catch(() => 0);
        } else {
          message.reply(`*ϟ Volume changed from **\`${volume}%\`** .*`).catch(() => 0);
        }
      }
    }
  }
    } else if (cmdsArray.skip.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) return message.reply(`🎶 There must be music playing to use that!`).catch(() => 0);
      try {
        const song = await queue.skip();
        if (useEmbeds) {
          const embed = new MessageEmbed()
            .setDescription(`***ϟ Skipped ${song.name}***`)
            .setColor(emco)
            .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169738053892460724/d4c0f597a003.png?ex=65567e74&is=65440974&hm=6bd3d52f027ee8c6803aa37dfd9702da63240c152a8c19a4c0a944a69e2fc890&");
          message.channel.send({ embeds: [embed] }).catch(() => 0);
        } else {
          message.channel.send(`***ϟ Skipped ${song.name}***`).catch(() => 0);
        }
      } catch (e) {
        if (`${e}`.includes("NO_UP_NEXT")) {
          await queue.stop().catch(() => 0);
          message.react(`✅`).catch(() => 0);
        } else {
          if (useEmbeds) {
            const embed = new MessageEmbed()
              .setColor(emco)
              .setDescription(`***ϟ Error ${song.name}***`);
            message.channel.send({ embeds: [embed] }).catch(() => 0);
          } else {
            message.channel.send(`***ϟ Error ${song.name}***`).catch(() => 0);
          }
        }
      }
    } if (cmdsArray.queue.some((cmd) => message.content.split(' ')[0] == cmd)) {
      const queue = client83883.music.getQueue(message);
      if (!queue) {
        if (useEmbeds) {
          const embed = new MessageEmbed()
          .setDescription(`**🎶 There must be music playing to use that!**`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169712150130995220/no.png?ex=65566654&is=6543f154&hm=b95ef265828fafc88f4adc56d7ba9f07d44557c4ce8796c790313d889040eafb&")
          .setColor(emco)   
          message.reply({ embeds: [embed] }).catch(() => 0);
        } else {
          message.reply(`🎶 There must be music playing to use that!`).catch(() => 0);
        }
        return;
      }
    
      const songNames = queue.songs.map((song, index) => `\`${index + 1}\`. ${song.name}`).join('\n');
    
    
      if (useEmbeds) {
        const embed = new MessageEmbed()
        .setAuthor(`ϟ Total songs :  ( ${queue.songs.length} )`)
          .setDescription(`*Now playing :* \n${songNames}`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169715395293368330/NowPlaying2.png?ex=6556695a&is=6543f45a&hm=6e62a05e091aedec594efe90190303f0f3fd9734c071c15403350773af9f4cc1&")
          .setColor(emco)
          .setFooter({ text: `${client83883.user.username}`, iconURL: `${client83883.user.displayAvatarURL({ dynamic: true })}` });
        message.channel.send({ embeds: [embed] }).catch(() => 0);
      } else {
        const embed = new MessageEmbed()
        .setAuthor(`ϟ Total songs :  ( ${queue.songs.length} )`)
          .setDescription(`*Now playing :* \n${songNames}`)
          .setThumbnail("https://cdn.discordapp.com/attachments/1091536665912299530/1169715395293368330/NowPlaying2.png?ex=6556695a&is=6543f45a&hm=6e62a05e091aedec594efe90190303f0f3fd9734c071c15403350773af9f4cc1&")
          .setColor(emco)
          .setFooter({ text: `${client83883.user.username}`, iconURL: `${client83883.user.displayAvatarURL({ dynamic: true })}` });
        message.channel.send({ embeds: [embed] }).catch(() => 0);      } 
    }
    

  client.on('messageCreate', message => {
    if (!message.guild) return; // تجاهل الرسائل الخاصة (DMs)
    if (message.author.bot) return; // تجاهل الرسائل من البوتات
  
    if (!message.content.startsWith(prefix)) return; // التحقق من أن الرسالة تبدأ بالمقدمة (prefix)
  
    const args = message.content.slice(prefix.length).trim().split(/ +/); // تقسيم محتوى الرسالة للحصول على المعاملات
    const command = args.shift().toLowerCase(); // الحصول على الأمر الرئيسي
  
    // الآن يمكن استخدام args
    if (command === 'setap') {
      let channel = message.member.voice.channel;
      if (!channel) {
        return message.reply('يرجى الدخول إلى روم صوتي.');
      }
  
      client83883.channels.cache.get(channel.id).join().then(connection => {
        client83883.user.setUsername(channel.name).then(() => {
          message.react('✅').catch(() => {});
        }).catch(err => {
          console.error('فشل في تغيير اسم البوت:', err);
          message.react('❌').catch(() => {});
        });
      }).catch(err => {
        console.error('فشل في دخول الروم:', err);
        message.react('❌').catch(() => {});
      });
    }
  });
  
  

  });
  try {
    await client83883.login(token);
  } catch (e) {
    console.log(`❌ > ${token} ${e}`);
  }
};




process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);
process.on("rejectionHandled", console.log);
