const os = require("os");
const moment = require("moment-timezone");
const axios = require("axios");
const { activeSockets } = require('../lib/sessionStore');
const config = require('../settings');
const fs = require('fs');
const { cmd, commands } = require('../lib/command')
const { downloadContentFromMessage } = require('baileyz');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions')

var amsg =''
if(config.LANG === 'SI') amsg = 'බොට් ආරක්ෂිතව සජීවිකර ඇතිද නැද්ද පරීක්‍ෂා කරන්න.'
else amsg = "Check bot online or no."

var pmsg =''
if(config.LANG === 'SI') pmsg = 'එය Bot වේගය පරීක්ශාකරයි.'
else pmsg = "Check bot's speed."

var mmsg =''
if(config.LANG === 'SI') mmsg = 'එය Bot විදාන ලැයිස්තුව ලබාදෙයි.'
else mmsg = "Get bot's command list."
;
var smsg =''
if(config.LANG === 'SI') smsg = 'එය Bot link ලබා දෙයි.'
else smsg = "It gives bot link."

var nmsg =''
if(config.LANG === 'SI') nmsg = 'එය Bot ගැන කෙටි විස්තරයක් ලබා දෙයි.'
else nmsg = "It gives bot shot information."


var ssmsg =''
if(config.LANG === 'SI') ssmsg = 'එය Bot පද්දතියේ විස්තර ලබා දෙයි.'
else ssmsg = "Get bot's system information."

var omsg =''
if(config.LANG === 'SI') omsg = 'එය Bot නිර්මාතෘන්ගේ නම්බර් ලබා දෙයි.'
else omsg = "Get bot's owners number."

var cmsg =''
if(config.LANG === 'SI') cmsg = 'එය Bot ප්‍රදාන සමූහය ලබා දෙයි.'
else cmsg = "Get bot official channel."

var bmsg =''
if(config.LANG === 'SI') bmsg = 'එකම Message එක ශාල ප්‍රමානයක් යැවීමට.'
else bmsg = "Send a message multiple times."

var vvmsg =''
if(config.LANG === 'SI') vvmsg = 'එක පාරක් බලන Message ගන්න.'
else vvmsg = "Get View One Message."

var aamsg =''
if(config.LANG === 'SI') aamsg = 'ක්‍රියාකාරි Session ගනන ලබා දෙයි.'
else aamsg = "Get Active Session Count."

var sudesc =''
if(config.LANG === 'SI') sudesc = 'බොට්ගේ යාවත්කාලීන කිරීම් නැරබීමට.'
else sudesc = "Show bot updates."




var vrepmsg =''
if(config.LANG === 'SI') vrepmsg = '*📛 View One Message එකකට Reply කරන්න.*'
else vrepmsg = "*📛 Reply View One Message.*"

var repmsg =''
if(config.LANG === 'SI') repmsg = '*📛 ඔබ හිමිකරුවකු නොවේ.*'
else repmsg = "*📛 You are not the owners.*"

var brormsg =''
if(config.LANG === 'SI') brormsg = '*📛 කරුනාකර වචනයක් දෙන්න.*'
else brormsg = "*📛 Please Give me a text.*"




//--------------- BOT' S ALIVE ------------------//
cmd({
  pattern: "alive",
  alias: ["info", "online"],
  desc: amsg,
  category: "main",
  react: "👋",
  filename: __filename
}, async (conn, mek, q, { from, prefix, pushname, reply }) => {
  try {
    
    const ownerdata = (await axios.get(
      "https://raw.githubusercontent.com/thinura-nethsara/ZEUS-X-MINI-DATA/refs/heads/main/Main/Details.json"
    )).data;

    const {
      alivemsg, footer, imageurl, alivevideo,
      version, botname, ownername, ownernumber,
      pairlink, header, platform, aliveimg, jid,
	  jidname, channel, title
    } = ownerdata;

   let hostname;
    const hostLen = os.hostname().length;
    if (hostLen === 12) hostname = "Replit";
    else if (hostLen === 36) hostname = "Heroku";
    else if (hostLen === 8) hostname = "Koyeb";
    else hostname = os.hostname();

    
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const uptime = runtime(process.uptime());

    
    const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    const time = moment().tz("Asia/Colombo").format("HH:mm:ss");
    const hour = moment().tz("Asia/Colombo").hour();
    const greetings =
      hour < 12 ? '*`සුභ උදෑසනක්` 🌄*' :
      hour < 17 ? '*`සුභ දහවලක්` 🏞️*' :
      hour < 20 ? '*`සුභ හැන්දෑවක්` 🌅*' :
                  '*`සුභ රාත්‍රියක්` 🌌*';

    
    let monospace = '```';
    const aliveMessage = `👋 ${greetings} ${monospace}${pushname}${monospace}

*╭──『 BOT'S INFO 』─◉◉➤*
*│👤 \`User\` : -* ${pushname}
*│🤖 \`Bot Name\` : -* ${botname}
*│🎡 \`Prefix\` : -* ${config.PREFIX}
*│🧬 \`Version\` : -* ${version}
*│💼 \`Work Type\` : -* ${config.WORK_TYPE}
*╰──────────────◉◉➤*

${alivemsg}`;

    
    const buttons = [
      { buttonId: `${prefix}menu`, buttonText: { displayText: "COMMAND MENU" }, type: 1 },
      { buttonId: `${prefix}ping`, buttonText: { displayText: "BOT\S SPEED" }, type: 1 },
      { buttonId: `${prefix}help`, buttonText: { displayText: "HELP CENTER" }, type: 1 }
    ];

const buttons1 = [
      { buttonId: `${prefix}menu`, buttonText: { displayText: "MENU CMD" }, type: 1 },
      { buttonId: `${prefix}ping`, buttonText: { displayText: "PING CMD" }, type: 1 },
      { buttonId: `${prefix}help`, buttonText: { displayText: "HELP CMD" }, type: 1 }
    ];

    
    await conn.sendMessage(from, { 
      video: { url: alivevideo },
      mimetype: "video/mp4",
      ptv: true
    }, { quoted: mek });


if (config.BUTTON === 'true') {

const buttonMessage = {
            image: { url: aliveimg },
            caption: aliveMessage,
            footer: footer,
            buttons: buttons1,
            headerType: 4 
        };

await conn.sendMessage(from, buttonMessage, { quoted: mek });

} else {

await conn.buttonMessage2(from, {
   text: aliveMessage,
   footer: footer,
   image: { url: aliveimg },
   buttons: buttons,
   headerType: 4,
}, mek);
}

  } catch (e) {
    console.error(e);
    reply(`*🚩 Alive Error :-*\n${e.message}`);
  }
});
