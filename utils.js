const {EmbedBuilder} = require('discord.js');

const DEFAULT = {
    LANGUAGE: "en-US",
    COLOR: "#26ba6d"
};

const COLORS = {
    RED: "#ff4833",
    BLUE: "#0000FF",
    GREEN: "#00FF00",
    GRAY: "#4e5058",
    ORANGE: "#facb3e",
    DEFAULT : DEFAULT.COLOR
};

function createEmbedMessage(guild, message) {
    let color = COLORS.DEFAULT;

    if (guild) color = guild.members.me.displayHexColor;
    
    const embed = new EmbedBuilder()
    .setDescription(message)
    .setColor(color)
    return embed;
}

module.exports = {
    createEmbedMessage, COLORS, DEFAULT
};