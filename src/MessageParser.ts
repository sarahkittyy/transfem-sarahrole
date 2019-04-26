import * as Discord from 'discord.js';

import Commands from './Commands';

import {beautifyText} from './EmbedFormatter';

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
		if(msg.startsWith(command.opt('prefix')))
		{
			//Remove the prefix.
			msg = msg.substr(command.opt('prefix').length);
			//Split at the space key..
			let args = msg.split(' ');
			//Try to run the command.
			if(!command.runCommand(message, args[0], args.slice(1)))
			{
				//Command didn't work.
				message.channel.send(beautifyText(`Invalid arguments. Try ${command.opt('prefix')}help ${args[0]} for help!`));	
			}
		}
		else
		{
			message.channel.send(beautifyText(`Invalid command. Try ${command.opt('prefix')}help for help!`));
		}
	}
};