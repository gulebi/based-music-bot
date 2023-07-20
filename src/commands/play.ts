import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { QueryType } from "discord-player";
import { colors, getUsername, getAvatar } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play track")
        .addStringOption((option) => option.setName("query").setDescription("query").setRequired(true)),
    execute: async ({ interaction, player }) => {
        try {
            await interaction.deferReply();

            const channel = interaction.inCachedGuild() && interaction.member.voice.channel;

            if (!channel)
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Вы не подключены к голосовому каналу!")
                            .setColor(colors.baseColor)
                            .setFooter({
                                text: getUsername(interaction),
                                iconURL: getAvatar(interaction),
                            }),
                    ],
                });

            const query = interaction.options.getString("query", true);

            await player.play<ChatInputCommandInteraction>(channel, query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
                nodeOptions: {
                    metadata: interaction,
                    bufferingTimeout: 3000,
                    leaveOnEnd: false,
                    leaveOnStop: false,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 60 * 1000 * 3,
                },
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
