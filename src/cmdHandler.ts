import { Collection, REST, Routes, Interaction } from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";
import { SlashCommand } from "./types";
import { getEnvVar } from "./utils";
import { Player } from "discord-player";

const rest = new REST().setToken(getEnvVar("TOKEN"));

const slashCommands = new Collection<string, SlashCommand>();

const cmdLoader = () => {
    try {
        const commandsPath = resolve(__dirname, "commands");

        const commandsArray = readdirSync(commandsPath);

        commandsArray.forEach((file) => {
            const { command } = require(`${commandsPath}/${file}`);

            if (command && command.data && command.execute) {
                slashCommands.set(command.data.name, command);
                // console.log(`${command.data.name} command is loaded!`);
            } else {
                console.warn(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`);
            }
        });

        console.log("Slash commands are loaded!");

        const slashCommandsArray = Array.from(slashCommands, ([key, value]) => value.data.toJSON());
        rest.put(Routes.applicationCommands(getEnvVar("ID")), { body: slashCommandsArray });

        console.log("Slash commands are registered!");
    } catch (error) {
        console.log(error);
    }
};

const cmdTrigger = (interaction: Interaction, player: Player) => {
    if (!interaction.isChatInputCommand()) return;

    const command = slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        command.execute({ interaction, player });
    } catch (error) {
        console.error(error);
        interaction.reply({
            content: "Error!",
        });
    }
};

export { cmdLoader, cmdTrigger };
