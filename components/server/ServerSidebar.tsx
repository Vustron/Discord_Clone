import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { iconMap, roleIconMap } from '@/constants/channelType';
import ServerChannel from '@/components/server/ServerChannel';
import ServerSection from '@/components/server/ServerSection';
import ServerHeader from '@/components/server/ServerHeader';
import ServerSearch from '@/components/server/ServerSearch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';

interface ServerSidebarProps {
	serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	// fetch current user profile
	const profile = await fetchCurrentProfile();

	// if there's no profile redirect to sign-in
	if (!profile) {
		return redirectToSignIn();
	}

	// fetch all server info based on server id
	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: 'asc',
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: 'asc',
				},
			},
		},
	});

	// channel filters(text,audio,video)
	const textChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.TEXT
	);
	const audioChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO
	);
	const videoChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO
	);

	// members filter
	const members = server?.members.filter(
		(member) => member.profileId !== profile.id
	);

	// if not redirect to home
	if (!server) {
		return redirect('/');
	}

	// find member roles
	const role = server.members.find(
		(member) => member.profileId === profile.id
	)?.role;

	return (
		<div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
			<ServerHeader server={server} role={role} />

			<ScrollArea className='flex-1 px-3'>
				<div className='mt-2'>
					<ServerSearch
						data={[
							{
								label: 'Text Channels',
								type: 'channel',
								data: textChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Audio Channels',
								type: 'channel',
								data: audioChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Video Channels',
								type: 'channel',
								data: videoChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Members',
								type: 'member',
								data: members?.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>

				<Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
				{!!textChannels?.length && (
					<div>
						<ServerSection
							sectionType='channels'
							channelType={ChannelType.TEXT}
							role={role}
							label='Text Channels'
						/>
						{textChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}

				{!!audioChannels?.length && (
					<div>
						<ServerSection
							sectionType='channels'
							channelType={ChannelType.AUDIO}
							role={role}
							label='Audio Channels'
						/>
						{audioChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}

				{!!videoChannels?.length && (
					<div>
						<ServerSection
							sectionType='channels'
							channelType={ChannelType.VIDEO}
							role={role}
							label='Video Channels'
						/>
						{videoChannels.map((channel) => (
							<ServerChannel
								key={channel.id}
								channel={channel}
								role={role}
								server={server}
							/>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;
