import { ActivityType, Client, Events } from "discord.js";
import { cmdLoader, cmdTrigger } from "../cmdHandler";
import { useMainPlayer } from "discord-player";

export default function registerClientEvents(client: Client) {
    client.once(Events.ClientReady, (c) => {
        cmdLoader();

        c.user.setActivity("на тебя!", { type: ActivityType.Watching });

        console.log(`${c.user.username} is up and running!`);
    });

    client.on(Events.InteractionCreate, (interaction) => {
        const player = useMainPlayer();

        if (player) {
            cmdTrigger(interaction, player);
        } else {
            console.log("Failed to get player instance!");
        }
    });
}
