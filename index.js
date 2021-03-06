// ! Imports and initialisations

require("dotenv").config();
const Discord = require("discord.js");
const status = require("minecraft-server-status-improved");
const Client = new Discord.Client();

// * Variables

let defaultValues = new Map();

// ! Message Template

const statusMessage = (response, server) => `
**Status for "${server}"**
--------------------------
Online: \`${response.online}\`
Description: \`${response.motd || "none"}\`
Players online: \`${response.players.now}\`
Player limit: \`${response.players.max}\`
Minecraft Version: \`${response.server.name || "unavailable"}\`
`;

// ! Functions

const getMessageContent = (message) => message.content.split(" ");

const determineCommand = (msg, channel, message) => {
    switch (msg[0]) {
        case ".ping":
            console.log("ping");
            channel.send(
                `Latency is ${Date.now() - message.createdTimestamp}ms.`
            );
            break;

        case ".status":
            if (msg[1]) {
                getMinecraftServerData(msg[1], channel);
            } else if (getState(getServerId(message))) {
                getMinecraftServerData(getState(getServerId(message)), channel);
            }
            break;

        case ".config":
            if (msg[1] == "server" && msg[2]) {
                modifyState(getServerId(message), msg[2]);
                channel.send(
                    "Successfully changed default server! Now you don't have to specify a server with the `.status` command!"
                );
            } else if (msg[1] == "show") {
                channel.send(
                    `The default status server is \`${getState(
                        getServerId(message)
                    )}\`.`
                );
            } else {
                channel.send(
                    msg[1]
                        ? "Please provide a minecraft server. Example: `.config server mc.server.com`."
                        : `Please provide an argument, such as: \`server\`, or \`show\`.`
                );
            }
            logDefaultValues();
            break;

        default:
            console.log("unknown command");
    }
};

const getServerId = (message) => message.guild.id;

const modifyState = (serverId, value) => {
    defaultValues.set(serverId, value);
};

const getState = (serverId) => {
    return defaultValues.get(serverId)
        ? defaultValues.get(serverId)
        : "No default server";
};

const logDefaultValues = () => console.log(defaultValues);

const getMinecraftServerData = (hostname, channel) => {
    status(hostname)
        .then((response) => {
            channel.send(statusMessage(response, hostname));
        })
        .catch((err) => {
            console.log(err);
        });
};

// ! Events

Client.on("message", (message) => {
    let msg = getMessageContent(message);
    if (msg[0].includes(".")) {
        determineCommand(msg, message.channel, message);
    }
});

Client.on("ready", () =>
    console.log(`
    ============================
        Minecraft Status Bot
    ============================
`)
);

// ! Login

Client.login(process.env.TOKEN);
