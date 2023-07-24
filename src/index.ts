import { Client, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import { getEnvVar } from "./utils";
import { registerClientEvents, registerPlayerEvents } from "./events";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
registerClientEvents(client);

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        filter: "audioonly",
    },
});
registerPlayerEvents(player);
player.extractors.loadDefault();

client.login(getEnvVar("TOKEN"));
