import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { colors, getAvatar, getUsername } from "../utils";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Shows the bot's ping"),
    execute: async ({ interaction, player }) => {
        try {
            const queue = interaction.inCachedGuild() && player.nodes.get(interaction.guildId);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Понг!")
                        .setColor(colors.baseColor)
                        .addFields(
                            {
                                name: "Пинг:",
                                value: `\`${interaction.client.ws.ping}ms\``,
                            },
                            {
                                name: "Пинг войса:",
                                value: !queue ? "`N/A`" : `\`${queue.ping ?? "`N/A`"}\`ms`,
                            }
                        )
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
