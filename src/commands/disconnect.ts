import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types.js";
import { colors, getAvatar, getUsername } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("disconnect").setDescription("Disconnect bot"),
    execute: async ({ interaction, player }) => {
        try {
            await interaction.deferReply();

            const queue = interaction.inCachedGuild() && player.nodes.get(interaction.guildId);

            if (!queue)
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Сейчас бот не в канале!")
                            .setColor(colors.baseColor)
                            .setFooter({
                                text: getUsername(interaction),
                                iconURL: getAvatar(interaction),
                            }),
                    ],
                });

            queue.setMetadata(interaction);
            queue.delete();

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Бот отключён!")
                        .setColor(colors.baseColor)
                        .setFooter({
                            text: getUsername(interaction),
                            iconURL: getAvatar(interaction),
                        }),
                ],
            });
        } catch (error) {
            console.error(error);
            return await interaction.editReply({
                content: "Error!",
            });
        }
    },
};

export { command };
