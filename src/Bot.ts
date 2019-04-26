import * as Discord from 'discord.js';
import * as fs from 'fs';

/**
 * Wrapper for this bot's functionality.
 */
export default class Bot
{
	private bot: Discord.Client;
	
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
		
		//Read the token from private/token.txt
		fs.readFile('private/token.txt', (err, data: Buffer)=>{
			if(err) throw err;
			this.bot.login(data.toString())
		});
	}	
};