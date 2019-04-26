import * as Discord from 'discord.js';
import * as fs from 'fs';

import Commands from './Commands';
import MessageParser from './MessageParser';

/**
 * Wrapper for this bot's functionality.
 */
export default class Bot
{
	/**
	 * The main discord client.
	 */
	private bot: Discord.Client;
	
	/**
	 * The command handler instance.
	 */
	private commands: Commands;
	
	/**
	 * The message parser.
	 */
	private parser: MessageParser;
	
	/**
	 * Init the bot instance.
	 */
	public constructor()
	{
		//Init the client.
		this.bot = new Discord.Client();
		
		//Bot events.
		this.bot.on('ready', ()=>{
			console.log(`Logged in as ${this.bot.user.username}, ${this.bot.user.id}.`);
		});
		
		this.bot.on('message', (message: Discord.Message) => {
			//Skip messages sent by the bot.
			if(message.author.id === this.bot.user.id)
			{
				return;
			}
			console.log(`received message ${message.content}`);
			this.parser.parse(message, this.commands);
		});
		
		//Read the token from private/token.txt
		fs.readFile('private/token.txt', (err, data: Buffer)=>{
			if(err) throw err;
			this.bot.login(data.toString())
		});
		
		//Init the commands.
		this.commands = new Commands();
		//Init the message parser.
		this.parser = new MessageParser();
		
		this.commands.addCommand('nyan', {
			callback: (err, msg)=>{
				msg.reply('nyan!');
			},
			desc: 'nyan command!'
		});
	}	
};