import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { colors, getAvatar, getUsername } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("previous").setDescription("Play previous track"),
    execute: async ({ interaction, player }) => {
        try {
            await interaction.deferReply();

            const queue = interaction.inCachedGuild() && player.nodes.get(interaction.guildId);

            if (!queue || !queue.isPlaying() || !queue.currentTrack)
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

            queue.setMetadata(interaction);
            queue.history.back();
        } catch (error) {
            console.error(error);
            return await interaction.editReply({
                content: "Error!",
            });
        }
    },
};

export { command };
