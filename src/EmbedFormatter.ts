import * as Discord from 'discord.js';

/**
 * Turn text into a beautiful embed.
 */
export function beautifyText(text: string): Discord.RichEmbed
{
	return new Discord.RichEmbed()
		.setColor(214783)
		.setTitle(text);
}