import { Player } from "discord-player";
import { EmbedBuilder } from "discord.js";
import { colors, getAvatar, getUsername } from "../utils";
import { Interaction } from "../types";

export default function registerPlayerEvents(player: Player) {
    player.events.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);

        const interaction = queue.metadata as Interaction;
        interaction.followUp({ content: "Error!" });
    });

    player.events.on("playerError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the player: ${error.message}`);
    });

    player.events.on("playerSkip", (queue, track) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user.username} cкипнул ${track.title} | ${track.author}!`)
                    .setColor(colors.baseColor),
            ],
        });
    });

    player.events.on("playerPause", (queue) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp({
            embeds: [new EmbedBuilder().setTitle("Плеер приостановлен!").setColor(colors.baseColor)],
        });
    });

    player.events.on("playerResume", (queue) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp({
            embeds: [new EmbedBuilder().setTitle("Плеер возобновлен!").setColor(colors.baseColor)],
        });
    });

    player.events.on("audioTrackAdd", (queue, track) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Трек добавлен в очередь")
                    .setColor(colors.baseColor)
                    .setDescription(`🎶 [\`${track.title}\`](${track.url})`)
                    .addFields([{ name: "Автор", value: `\`${track.author}\``, inline: true }])
                    .setThumbnail(track.thumbnail),
            ],
        });
    });

    player.events.on("playerStart", (queue, track) => {
        const interaction = queue.metadata as Interaction;

        const channel = interaction.channel;

        channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Сейчас играет")
                    .setColor(colors.baseColor)
                    .setDescription(`🎶 [\`${track.title}\`](${track.url})`)
                    .setThumbnail(track.thumbnail)
                    .addFields([
                        {
                            name: "Добавлен",
                            value: `\`${track.requestedBy?.username || "Someone"}\``,
                            inline: true,
                        },
                        { name: "Автор", value: `\`${track.author}\``, inline: true },
                        { name: "Длительность", value: `\`${track.duration}\``, inline: true },
                    ]),
            ],
        });
    });

    player.events.on("disconnect", (queue) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp("Меня вручную отключили от голосового канала, очищаю очередь!");
    });

    player.events.on("emptyChannel", (queue) => {
        const interaction = queue.metadata as Interaction;

        interaction.followUp("В голосовом канале никого нет, ливаю...");
    });

    player.events.on("playerFinish", (queue) => {
        const interaction = queue.metadata as Interaction;

        const channel = interaction.channel;

        channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Очередь закончена")
                    .setColor(colors.baseColor)
                    .setDescription("Добавьте в очередь больше треков")
                    .setFooter({
                        text: getUsername(interaction),
                        iconURL: getAvatar(interaction),
                    }),
            ],
        });
    });
}
