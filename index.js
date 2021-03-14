// * Imports and initialisations

require("dotenv").config();
const Discord = require("discord.js");
const status = require("minecraft-server-status-improved");
const Client = new Discord.Client();

// * Message Template

const statusMessage = (response, server) => `
**Status for "${server}"**
--------------------------
Online: \`${response.online}\`
Description: \`${response.motd || "none"}\`
Players online: \`${response.players.now}\`
Player limit: \`${response.players.max}\`
Minecraft Version: \`${response.server.name || "unavailable"}\`
`;

// * Functions

const getMessageContent = (message) => message.content.split(" ");

const determineCommand = (msg, channel) => {
    switch (msg[0]) {
        case ".ping":
            console.log("ping");
            break;

        case ".status":
            status(msg[1])
                .then((response) => {
                    channel.send(statusMessage(response, msg[1]));
                })
                .catch((err) => {
                    console.log(err);
                });
            break;

        default:
            console.log("unknown command");
    }
};

// * Events

Client.on("message", (message) => {
    let msg = getMessageContent(message);
    if (msg[0].includes(".")) {
        determineCommand(msg, message.channel);
    }
});

Client.on("ready", () =>
    console.log(`
    ============================
        Minecraft Status Bot
    ============================
`)
);

Client.login(process.env.TOKEN);
