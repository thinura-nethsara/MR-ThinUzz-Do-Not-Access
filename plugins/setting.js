// plugins/setting.js
const config = require('../settings')
const { cmd } = require('../lib/command')
const { input, get, updb } = require("../lib/database")

// Helper function to check if sender is bot itself
const isBotItself = (conn, sender) => {
    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    return sender === botNumber;
}

// Helper to check owner
const isOwnerNumber = (sender) => {
    const ownerNumbers = config.OWNER_NUMBERS ? config.OWNER_NUMBERS.split(',') : [];
    const cleanSender = sender.split('@')[0].replace(/[^0-9]/g, '');
    const cleanOwnerMain = config.OWNER_NUMBER ? config.OWNER_NUMBER.replace(/[^0-9]/g, '') : '';
    
    if (cleanSender === cleanOwnerMain) return true;
    if (ownerNumbers.includes(cleanSender)) return true;
    
    const sudoNumbers = config.SUDO_NUMBERS ? config.SUDO_NUMBERS.split(',') : [];
    if (sudoNumbers.includes(cleanSender)) return true;
    
    return false;
}

// ================= MAIN SETTINGS COMMAND =================
cmd({
    pattern: "setting",
    alias: ["settings", "config"],
    desc: "Bot settings menu",
    category: "owner",
    filename: __filename
},
async(conn, mek, m,{ from, q, isOwner, reply, sender, prefix }) => {
try{
    const isMe = isBotItself(conn, sender);
    const isOwn = isOwnerNumber(sender) || isOwner;
    
    if (!isOwn && !isMe) return reply("*Owner only command ❌*")
    
    const args = q.trim().split(/\s+/);
    const subCommand = args[0]?.toLowerCase();
    
    // Get current settings
    const buttonStatus = await get("BUTTON") || config.BUTTON || "false"
    const workMode = await get("WORK_TYPE") || config.WORK_TYPE || "public"
    const prefixSetting = await get("PREFIX") || config.PREFIX || "."
    
    // ========== HANDLE SUB COMMANDS ==========
    
    // Toggle button mode
    if (subCommand === "button" || subCommand === "btn") {
        const newStatus = buttonStatus === "true" ? "false" : "true";
        await input("BUTTON", newStatus);
        await updb();
        return reply(`*Button Mode:* ${newStatus === "true" ? "✅ ENABLED" : "❌ DISABLED"}*`);
    }
    
    // Change work mode
    if (subCommand === "mode" && args[1]) {
        const validTypes = ["public", "private", "group"];
        if (!validTypes.includes(args[1].toLowerCase())) {
            return reply("*Invalid mode! Use: public / private / group*");
        }
        await input("WORK_TYPE", args[1].toLowerCase());
        await updb();
        return reply(`*Work Mode:* ${args[1].toUpperCase()} ✅`);
    }
    
    // Change prefix
    if (subCommand === "prefix" && args[1]) {
        if (args[1].length > 3) return reply("*Prefix too long! Max 3 characters*");
        await input("PREFIX", args[1]);
        await updb();
        return reply(`*New Prefix:* ${args[1]} ✅`);
    }
    
    // Reset all settings
    if (subCommand === "reset") {
        await input("BUTTON", "false");
        await input("WORK_TYPE", "public");
        await input("PREFIX", ".");
        await updb();
        return reply("*All settings reset to default ✅*");
    }
    
    // Help
    if (subCommand === "help") {
        const helpMsg = `╭━━━〔 *⚙️ SETTINGS HELP* 〕━━━╮
┃
┃ 📌 *Commands:*
┃
┃ ${prefix}setting - Show settings menu
┃ ${prefix}setting button - Toggle button mode
┃ ${prefix}setting mode <type> - Change work mode
┃ ${prefix}setting prefix <symbol> - Change prefix
┃ ${prefix}setting reset - Reset all settings
┃ ${prefix}setting help - Show this help
┃
┃ 🔧 *Work Types:*
┃ • public - Everyone can use
┃ • private - Only owner can use  
┃ • group - Only in groups
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        return reply(helpMsg);
    }
    
    // ========== SHOW SETTINGS MENU ==========
    
    const statusIcon = (value, trueValue) => value === trueValue ? "✅" : "❌";
    
    const menuMsg = `╭━━━━〔 *⚙️ BOT SETTINGS* 〕━━━━╮
┃
┃ 👤 *User:* ${sender.split('@')[0]}
┃
┃ 📊 *Current Settings:*
┃
┃ 🔘 *Button Mode:* ${buttonStatus === "true" ? "✅ ENABLED" : "❌ DISABLED"}
┃ 🔧 *Work Mode:* ${workMode.toUpperCase()}
┃ 📝 *Prefix:* ${prefixSetting}
┃
┃ 🎮 *Quick Commands:*
┃
┃ 🔘 Toggle Button: *${prefixSetting}setting button*
┃ 🔧 Change Mode: *${prefixSetting}setting mode public*
┃ 📝 Change Prefix: *${prefixSetting}setting prefix #*
┃ 🔄 Reset All: *${prefixSetting}setting reset*
┃ ❓ Help: *${prefixSetting}setting help*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

💡 *Tip:* Use .mode , .button , .setprefix for direct commands`;

    // Send with buttons if enabled
    if (buttonStatus === "true") {
        const buttons = [
            { buttonId: `${prefixSetting}setting button`, buttonText: { displayText: `🔘 BUTTON` }, type: 1 },
            { buttonId: `${prefixSetting}mode public`, buttonText: { displayText: `🌐 PUBLIC` }, type: 1 },
            { buttonId: `${prefixSetting}mode private`, buttonText: { displayText: `🔒 PRIVATE` }, type: 1 },
            { buttonId: `${prefixSetting}mode group`, buttonText: { displayText: `👥 GROUP` }, type: 1 },
            { buttonId: `${prefixSetting}setting reset`, buttonText: { displayText: `🔄 RESET` }, type: 1 },
            { buttonId: `${prefixSetting}setting help`, buttonText: { displayText: `❓ HELP` }, type: 1 }
        ];
        
        await conn.sendMessage(from, { text: menuMsg, buttons }, { quoted: mek });
    } else {
        await reply(menuMsg);
    }
    
} catch(e){
    console.log(e);
    reply("*Error loading settings ❌*");
}
});

// ================= EMOJI SETTINGS =================
cmd({
    pattern: "emoji",
    alias: ["likeemoji", "setemoji"],
    desc: "Set auto like emojis",
    category: "owner",
    filename: __filename
},
async(conn, mek, m,{ q, isOwner, reply, sender, prefix }) => {
try{
    const isMe = isBotItself(conn, sender);
    const isOwn = isOwnerNumber(sender) || isOwner;
    
    if (!isOwn && !isMe) return reply("*Owner only command ❌*")
    
    if (!q) {
        const emojiMsg = `╭━━〔 *😊 EMOJI SETTINGS* 〕━━╮
┃
┃ 📌 *Commands:*
┃
┃ ${prefix}emoji hearts - 💖 Hearts preset
┃ ${prefix}emoji thumbs - 👍 Thumbs preset
┃ ${prefix}emoji fire - 🔥 Fire preset
┃ ${prefix}emoji all - 🎉 All emojis
┃ ${prefix}emoji ❤️,👍,🔥 - Custom emojis
┃
┃ 🎨 *Presets:*
┃ • Hearts: ❤️ 💜 💙 💚 💛 🧡
┃ • Thumbs: 👍 👎 👏 🙌 🤝 💪
┃ • Fire: 🔥 💯 ⭐ ✨ 🌟 ⚡
┃ • All: ❤️ 👍 🔥 🎉 💜 😂 😍 🥳
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        return reply(emojiMsg);
    }
    
    let emojis = [];
    const input = q.toLowerCase();
    
    if (input === "hearts") {
        emojis = ['❤️', '💜', '💙', '💚', '💛', '🧡'];
        await input("AUTO_LIKE_EMOJI", emojis);
        await updb();
        return reply(`✅ *Emojis set to HEARTS preset*\n\n${emojis.join('  ')}`);
    }
    
    if (input === "thumbs") {
        emojis = ['👍', '👎', '👏', '🙌', '🤝', '💪'];
        await input("AUTO_LIKE_EMOJI", emojis);
        await updb();
        return reply(`✅ *Emojis set to THUMBS preset*\n\n${emojis.join('  ')}`);
    }
    
    if (input === "fire") {
        emojis = ['🔥', '💯', '⭐', '✨', '🌟', '⚡'];
        await input("AUTO_LIKE_EMOJI", emojis);
        await updb();
        return reply(`✅ *Emojis set to FIRE preset*\n\n${emojis.join('  ')}`);
    }
    
    if (input === "all") {
        emojis = ['❤️', '👍', '🔥', '🎉', '💜', '😂', '😍', '🥳', '✨', '⭐'];
        await input("AUTO_LIKE_EMOJI", emojis);
        await updb();
        return reply(`✅ *Emojis set to ALL preset*\n\n${emojis.join('  ')}`);
    }
    
    // Custom emojis (comma separated)
    emojis = q.split(',').map(e => e.trim()).filter(e => e.length > 0);
    if (emojis.length > 0) {
        await input("AUTO_LIKE_EMOJI", emojis);
        await updb();
        return reply(`✅ *Custom emojis set*\n\n${emojis.join('  ')}`);
    }
    
    reply("*Invalid option! Use: hearts, thumbs, fire, all, or custom emojis*");
    
} catch(e){
    console.log(e);
    reply("*Error setting emojis ❌*");
}
});

// ================= QUICK SETTINGS =================
cmd({
    pattern: "toggle",
    alias: ["tgl"],
    desc: "Quick toggle settings",
    category: "owner",
    filename: __filename
},
async(conn, mek, m,{ q, isOwner, reply, sender, prefix }) => {
try{
    const isMe = isBotItself(conn, sender);
    const isOwn = isOwnerNumber(sender) || isOwner;
    
    if (!isOwn && !isMe) return reply("*Owner only command ❌*")
    
    const option = q?.toLowerCase();
    
    if (!option) {
        return reply(`*Quick Toggle Commands:*\n\n${prefix}toggle button - Toggle button mode\n${prefix}toggle mode - Cycle work mode\n${prefix}toggle all - Reset all`);
    }
    
    if (option === "button") {
        const current = await get("BUTTON") || "false";
        const newVal = current === "true" ? "false" : "true";
        await input("BUTTON", newVal);
        await updb();
        return reply(`*Button Mode:* ${newVal === "true" ? "✅ ENABLED" : "❌ DISABLED"}`);
    }
    
    if (option === "mode") {
        const current = await get("WORK_TYPE") || "public";
        const modes = ["public", "private", "group"];
        const currentIndex = modes.indexOf(current);
        const newMode = modes[(currentIndex + 1) % modes.length];
        await input("WORK_TYPE", newMode);
        await updb();
        return reply(`*Work Mode:* ${newMode.toUpperCase()} ✅`);
    }
    
    if (option === "all") {
        await input("BUTTON", "false");
        await input("WORK_TYPE", "public");
        await input("PREFIX", ".");
        await updb();
        return reply("*All settings reset to default ✅*");
    }
    
    reply(`*Unknown option: ${option}*\nUse: button, mode, all`);
    
} catch(e){
    console.log(e);
    reply("*Error ❌*");
}
});
