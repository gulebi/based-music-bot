import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { colors, getAvatar, getUsername } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("Now playing track info"),
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

            const progress = queue.node.createProgressBar()!;

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Сейчас играет")
                        .setColor(colors.baseColor)
                        .setDescription(`🎶 [\`${queue.currentTrack.title}\`](${queue.currentTrack.url})`)
                        .addFields([
                            {
                                name: "Добавлен",
                                value: `\`${queue.currentTrack.requestedBy?.username || "Someone"}\``,
                                inline: true,
                            },
                            { name: "Автор", value: `\`${queue.currentTrack.author}\``, inline: true },
                            { name: "Длительность", value: `\`${queue.currentTrack.duration}\``, inline: true },
                            { name: "\u200b", value: progress },
                        ])
                        .setThumbnail(queue.currentTrack.thumbnail)
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
