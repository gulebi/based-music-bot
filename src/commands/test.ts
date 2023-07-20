import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types.js";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command")
        .addStringOption((option) => option.setName("query").setDescription("query").setRequired(true)),
    execute: async ({ interaction }) => {
        try {
            return await interaction.reply({
                content: interaction.user.username,
            });
        } catch (error) {
            console.error(error);
            return await interaction.editReply({
                content: "Error!",
            });
        }
    },
};

export default command;
