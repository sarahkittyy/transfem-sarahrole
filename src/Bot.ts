import * as Discord from 'discord.js';
import * as fs from 'fs';

import Compliments = require('../Compliments.json');

import Commands from './Commands';
import MessageParser from './MessageParser';
import RoleGroups from './RoleGroups';

import {beautifyText} from './EmbedFormatter';

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
	 * The role groups instance.
	 */
	private rolegroups: RoleGroups;
	
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
			
			this.bot.user.setActivity('with sarahpin <3', {
				type: 'PLAYING'
			});
		});
		
		this.bot.on('message', (message: Discord.Message) => {
			//Skip messages sent by the bot.
			if(message.author.id === this.bot.user.id)
			{
				return;
			}
			
			if(/^(nya|wan|pyon|awoo)\b(.*)$/i.test(message.content))
			{
				message.channel.send(`*pats <@${message.author.id}>*`);
				return;
			}
			
			if(/^potato$/i.test(message.content) && message.author.id === '111541029143867392')
			{
				message.channel.send(`.potato here's a potato :potato:`);
				return;
			}
			
			if(/^hewwo yes me$/i.test(message.content))
			{
				let compliment = Compliments[message.author.id];
				if(compliment)
				{
					message.reply(beautifyText(`<@${message.author.id}> ${compliment}`));
					return;
				}
			}
			
			console.log(`received message ${message.content}`);
			this.parser.parse(message, this.commands);
		});
		
		//Read the token from private/token.txt
		fs.readFile('private/token.txt', (err, data: Buffer)=>{
			if(err) throw err;
			this.bot.login(data.toString())
		});
		
		//Init the role groups.
		this.rolegroups = new RoleGroups();
		
		//Init the commands.
		this.commands = new Commands();
		//Init the message parser.
		this.parser = new MessageParser();
		
		this.commands.addCommand('iam', {
			desc: 'Assign yourself a role',
			args: [
				{
					name: 'Role',
					desc: 'The role to give yourself',
					type: 'string'
				}
			],
			callback: (err: Error, msg: Discord.Message, ...role: string[]) => {
				this.rolegroups.assignRole(msg, this.bot, role.join(' '));
			}
			
		});
		
		this.commands.addCommand('iamn', {
			desc: 'Remove a role from yourself',
			args: [
				{
					name: 'Role',
					desc: 'The role to take from yourself',
					type: 'string'
				}
			],
			callback: (err: Error, msg: Discord.Message, ...role: string[]) => {
				this.rolegroups.removeRole(msg, this.bot, role.join(' '));
			}
		});
	}	
};