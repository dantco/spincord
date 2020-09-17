/**
 * spincord.ts
 */

import { Message, MessageAttachment } from 'discord.js';
import { findAlbum, getReleaseDetails } from './discogs';

export const getStartingPrice = async (query: string): Promise<string> => {
    const { resource_url } = await findAlbum(query);
    const release = await getReleaseDetails(resource_url);
    const { id, title, num_for_sale, lowest_price } = release;
    const marketplaceUrl = `https://www.discogs.com/sell/release/${id.toString()}`;
    const startingPrice = lowest_price.toFixed(2);
    if (num_for_sale < 1) {
        return `Sorry but it looks like you're the only one trying to sell one of those right now.\n\n${marketplaceUrl}`;
    }
    if (lowest_price > 500) {
        return `WOAH! *Certified RARE grail.* There's currently ${num_for_sale} of those listed for sale starting at ***$${startingPrice}***!! :money_with_wings:\n\n${marketplaceUrl}`;
    }
    if (lowest_price > 100) {
        return `Wow! Must be pretty rare. ${num_for_sale} of those are listed for sale right now starting at **$${startingPrice}**.\n\n${marketplaceUrl}`;
    }
    return `There are ${num_for_sale} listings for ${title} starting at $${startingPrice}.\n\n${marketplaceUrl}`;
};

export const getAlbumArt = async (query: string): Promise<MessageAttachment> => {
    const { cover_image } = await findAlbum(query);
    const attachment = new MessageAttachment(cover_image);
    return attachment;
};

export const getAlbumInfo = async (query: string): Promise<string> => {
    const { uri } = await findAlbum(query);
    const message = 'https://discogs.com' + uri;
    return message;
};

/**
 * Spincord()
 * Takes a discord command and sends a reply string.
 * @param command string discord command being issued
 * @param query the argument string following the command
 */
export const Spincord = async (message: Message, command: string, query: string): Promise<void> => {
    const { channel } = message;
    switch (command) {
        case 'album':
            channel.send(await getAlbumInfo(query));
            break;
        case 'albumart':
            channel.send(await getAlbumArt(query));
            break;
        case 'pricecheck':
            channel.send(await getStartingPrice(query));
            break;
        case 'spincord':
        case 'spincordhelp':
        case 'spincord-help':
            // Send help message string
            channel.send(
                '**How to Use Spincord**\n' +
                    ":scroll:\t`!album [album name]` -> posts [album name]'s title, artist, and link to discogs release. Cover art attached.\n" +
                    ':frame_photo:\t`!albumart [album name]` -> posts the cover art for [album name]\n' +
                    ':money_with_wings:\t`!pricecheck [album name]` -> lets you know what [album name] is currently going for on the market\n' +
                    ':person_raising_hand:\t`!spincord` -> displays this message',
            );
            break;
    }
};

export default Spincord;
