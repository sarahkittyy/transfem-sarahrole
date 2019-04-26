import * as Discord from 'discord.js';

import Commands from './Commands';

import {beautifyText} from './EmbedFormatter';

/**
 * Escapes a string containing regex characters so that it is regex-compatible
 */
function escapeRegExp(str: string): string
{
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Parses messages and calls the appropriate callbacks.
 */
export default class MessageParser
{
	/**
	 * Init the parser.
	 */
	public constructor()
	{
		
	}
	
	/**
	 * Parse the given message. If it's a command, run the command in the commands handler.
	 */
	public parse(message: Discord.Message, command: Commands): void
	{
		//Check if the message starts with the cmd prefix.
		let msg: string = message.content;
		
		let re = new RegExp(`^${escapeRegExp(command.opt('prefix'))}\\w+`);
		
		if(re.test(msg))
		{
			//Remove the prefix.
			msg = msg.substr(command.opt('prefix').length);
			//Split at the space key..
			let args = msg.split(' ');
			//Try to run the command.
			let state = command.runCommand(message, args[0], ...args.slice(1));
			if(state === 'args')
			{
				//Command didn't work.
				message.channel.send(beautifyText(`Invalid arguments. Try ${command.opt('prefix')}help ${args[0]} for help!`));	
			}
			else if(state === 'none')
			{
				//Command doesn't exist.
				message.channel.send(beautifyText(`Command doesn't exist. Try ${command.opt('prefix')}help for help!`));
			}
		}
	}
};