import { Interaction } from "../types";

export const getUsername = (interaction: Interaction, author?: boolean): string => {
    if (author) {
        return interaction.user.username;
    } else {
        return interaction.client.user.username;
    }
};

export const getAvatar = (interaction: Interaction, author?: boolean, size: number = 512): string => {
    const defaultAvatar = `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=mp&f=y`;

    if (author) {
        return `${interaction.user.avatarURL()}?size=${size}` || defaultAvatar;
    } else {
        return `${interaction.client.user.avatarURL()}?size=${size}` || defaultAvatar;
    }
};
