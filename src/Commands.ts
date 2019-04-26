import * as Discord from 'discord.js';
import { beautifyText } from './EmbedFormatter';

export interface CommandArg
{
	name: string;
	desc: string;
	type: string;
	default?: any;	
};

export interface Command
{
	desc: string;
	args?: Array<CommandArg>;
	callback: (err: Error | null, msg: Discord.Message, ...args: any[]) => void;
};

interface CommandOpts
{
	prefix: string;
};

/**
 * Handles implementing, parsing, and running discord commands.
 */
export default class Commands
{
	/**
	 * Map of command names to their data.
	 */
	private commands: Map<string, Command>;
	
	private opts: CommandOpts;
	
	/**
	 * The commands constructor.
	 */
	public constructor()
	{
		//Init everyhting.
		this.commands = new Map<string, Command>();
		this.opts = {
			prefix: '~$'
		};
		
		//Automatically implement help() command.
		this.addCommand('help', {
			desc: 'Display a help message',
			args: [
				{
					default: 'all',
					desc: 'The command to get help with.',
					name: 'Command',
					type: 'string'
				}
			],
			callback: (err: Error | null, msg: Discord.Message, command: any) => {
				if(err) return;
				if(command && command.length >= 1)
				{
					msg.channel.send(beautifyText(this.helpCommand(command[0])));
				}
				else
				{
					msg.channel.send(beautifyText(this.help()));
				}
			}
		});
	}
	
	/**
	 * Get/Set the option.
	 */
	public opt(opt: string, value?: any): any
	{
		if(value)
		{
			this.opts[opt] = value;
		}
		else
		{
			return this.opts[opt];
		}
	}
	
	/**
	 * Return a string representing descriptions for all the commands.
	 */
	public help(): string
	{
		//Construct the help string.
		let header: string = 'Sarahrole -- For self-assigning custom roles! >w<~<3\nCommands:\n';
		let commandStrings: string[] = [];
		this.commands.forEach((value: Command, name: string) => {
			let argStrings: string[] = [];
			if(value.args)
			{
				let lb = (exists: boolean) => {return exists ? '[' : '{'};
				let rb = (exists: boolean) => {return exists ? ']' : '}'};
				value.args.forEach((value: CommandArg) => {
					argStrings.push(`${lb(value.default)}${value.name}:${value.type}${rb(value.default)}`);
				});
			}
			commandStrings.push(` - ${this.opts.prefix}${name} ${argStrings.join(' ')} -- ${value.desc}`);
		});
		let footer: string = `\nSee ${this.opts.prefix}help (command) for details.`;
		
		return header + commandStrings.join('\n') + footer;
	}
	
	/**
	 * Return a string of the help message for a specific command
	 */
	public helpCommand(command: string): string
	{
		let cmd = this.commands.get(command);
		if(!cmd)
		{
			return `That's not a valid command! try ${this.opts.prefix}help for a list of them! >w<`;
		}
		//Get a short version of all the args..
		let argStrings: string[] = [];
		if(cmd.args)
		{
			let lb = (exists: boolean) => {return exists ? '[' : '{'};
			let rb = (exists: boolean) => {return exists ? ']' : '}'};
			cmd.args.forEach((value: CommandArg) => {
				argStrings.push(`${lb(value.default)}${value.name}:${value.type}${rb(value.default)}`);
			});
		}
		let header: string = `${this.opts.prefix}${command} ${argStrings.join(' ')} -- ${cmd.desc}\n`;
		//And now clear it for a long version of the args.
		argStrings = [];
		if(cmd.args)
		{
			argStrings.push('Args:');
			cmd.args.forEach((value: CommandArg) => {
				argStrings.push(` - ${value.name}:${value.type} - ${value.desc} ${value.default ? 'Defaults to ' + value.default : ''}.`);
			});
		};
		
		return header + argStrings.join('\n');
	}
	
	/**
	 * Add a command with the given name and data.
	 */
	public addCommand(name: string, cmd: Command): void
	{
		this.commands.set(name, cmd);
	}
	
	/**
	 * Run the given command.
	 */
	public runCommand(msg: Discord.Message, name: string, ...args: any[]): 'none' | 'args' | 'good'
	{
		//Grab the command.
		let cmd: Command = this.commands.get(name);
		if(!cmd)
		{
			return 'none';
		}
		
		let newArgs: any[] = [];
		
		//Iterate over all args.
		//If we run out of args in the args[] array,
		//Substitute in default args.
		if(cmd.args)
		{
			cmd.args.forEach((value, index)=>{
				let given = args[index];
				if(given) //If it was given...
				{	
					newArgs.push(given);
				}
				else if (value.default) //Otherwise, if there's a default value..
				{
					newArgs.push(value.default);
				}
				else //Otherwise..
				{
					//Error.
					cmd.callback(new Error('Invalid Args.'), msg);
					return 'args';
				}
			});
		}
		else
		{
			newArgs = args;
		}
		
		//Run the callback with the given args.
		cmd.callback(null, msg, ...newArgs);
		return 'good';
	}
	
};
