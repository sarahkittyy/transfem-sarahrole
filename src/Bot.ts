import * as Discord from 'discord.js';
import * as fs from 'fs';

import Commands from './Commands';

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
			
		});
		
		//Read the token from private/token.txt
		fs.readFile('private/token.txt', (err, data: Buffer)=>{
			if(err) throw err;
			this.bot.login(data.toString())
		});
		
		//Init the commands.
		this.commands = new Commands();
	}	
};