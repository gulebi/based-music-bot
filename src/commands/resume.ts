import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { colors, getAvatar, getUsername } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resume player"),
    execute: async ({ interaction, player }) => {
        try {
            await interaction.deferReply();

            const queue = interaction.inCachedGuild() && player.nodes.get(interaction.guildId);

            if (!queue || !queue.isPlaying())
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Сейчас музыка не играет!")
                            .setColor(colors.baseColor)
                            .setFooter({
                                text: getUsername(interaction),
                                iconURL: getAvatar(interaction),
                            }),
                    ],
                });

            if (queue.node.isPlaying())
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Плеер уже возобновлен!")
                            .setColor(colors.baseColor)
                            .setFooter({
                                text: getUsername(interaction),
                                iconURL: getAvatar(interaction),
                            }),
                    ],
                });

            queue.setMetadata(interaction);
            queue.node.resume();
        } catch (error) {
            console.error(error);
            return await interaction.editReply({
                content: "Error!",
            });
        }
    },
};

export { command };
