import { Player } from "discord-player";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder | any;
    execute: ({ interaction, player }: { interaction: ChatInputCommandInteraction; player: Player }) => void;
}

export type Interaction = ChatInputCommandInteraction;
