import * as Discord from 'discord.js';
import { beautifyText } from './EmbedFormatter';

/**
 * A single role group.
 */
interface Group
{
	roles: Array<string>;
	max: number
};

/**
 * Manages groups defined in groups.json, allowing quick role assignment and switching.
 */
export default class RoleGroups
{
	/**
	 * The defined groups from groups.json
	 */
	private groups: Map<string, Group>;
	
	/**
	 * Initialize the groups from groups.json
	 */
	public constructor()
	{
		//Init the groups.
		this.groups = new Map<string, Group>();
		
		//Load the groups json.
		let groupsjson: object = require('../groups.json');
		if(!groupsjson['groups'])
		{
			throw new Error('Groups.json has no groups property!!');
		}
		if(groupsjson['piper'] !== 'loved')
		{
			throw new Error('PIPER IS LOVED,, LET HER BE LOVED');
		}
		//Iterate over all groups.
		for(let [name, value] of Object.entries<Group>(groupsjson['groups']))
		{
			this.groups.set(name, value);
		}
	}
	
	/**
	 * Remove the role from the author of the given message.
	 */
	public removeRole(msg: Discord.Message, bot: Discord.Client, role: string): void
	{
		//Get the guild member.
		let guild = bot.guilds.get(msg.guild.id);
		guild.fetchMember(msg.author).then((user)=>{
		
		if(!this.toRole(role, guild))
		{
			msg.channel.send(beautifyText(`Role not found! >w<`));
		}
		else
		{
			user.removeRole(this.toRole(role, guild), 'Asked to remove role.').then((_)=>{
				msg.channel.send(beautifyText(`Role ${role} removed! <3`));
			});
		}
		
		});
	}
	
	/**
	 * Assigns a user a role in a group, un-assigning other roles in that group.
	 */
	public assignRole(msg: Discord.Message, bot: Discord.Client, role: string): void
	{
		//Get the guild member.
		let guild = bot.guilds.get(msg.guild.id);
		guild.fetchMember(msg.author).then((user)=>{
		
		//Get the role group (and assert the role exists in it.)
		let group = this.getRoleGroup(role);
		if(!group)
		{
			msg.channel.send(beautifyText(`Invalid role!`));
			return;
		}
		if(!this.toRole(role, guild))
		{
			msg.channel.send(beautifyText(`That role's in the list of acceptable roles, yet it's not available! Contact staff <3`));
			return;
		}
		
		let promises: Promise<Discord.GuildMember>[] = new Array<Promise<Discord.GuildMember>>();
		//First, remove all roles from this group.
		group.roles.forEach((role: string) => {
			let r = this.toRole(role, guild);
			if(r) promises.push(user.removeRole(this.toRole(role, guild), 'Updating group roles'));
		});
		//Now, append the new role.
		Promise.all(promises).then((val)=>{
			user.addRole(this.toRole(role, guild), 'Added group role.').then((val) => {
				msg.channel.send(beautifyText(`Set role to ${role} for ${user.nickname || user.displayName}`));
			});
		});
		
		});
	}
	
	/**
	 * Returns the group a specific role is in.
	 */
	private getRoleGroup(role: string): Group | null
	{
		for(const [name, group] of this.groups.entries())
		{
			if(group.roles.find(n => n.toLowerCase() === role.toLowerCase()))
			{
				return group;
			}
		}
		return null;
	}
	
	/**
	 * Convert a role string to a guild role.
	 */
	private toRole(role: string, guild: Discord.Guild): Discord.Role | null
	{
		let r: Discord.Role = guild.roles.find((value: Discord.Role) => {return value.name.toLowerCase() === role.toLowerCase()});
		if(r)
		{
			return r;
		}
		else
		{
			return null;
		}
		
	}
};