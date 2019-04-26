import * as Discord from 'discord.js';

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
	 * Add a command with the given name and data.
	 */
	public addCommand(name: string, cmd: Command): void
	{
		this.commands.set(name, cmd);
	}
	
	/**
	 * Run the given command.
	 */
	public runCommand(msg: Discord.Message, name: string, ...args: any[]): boolean
	{
		//Grab the command.
		let cmd: Command = this.commands.get(name);
		if(!cmd)
		{
			return false;
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
				}
			});
		}
		else
		{
			newArgs = args;
		}
		
		//Run the callback with the given args.
		cmd.callback(null, msg, ...newArgs);
		return true;
	}
	
};
