import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import ServerHeader from '@/components/server/ServerHeader';
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
		</div>
	);
};

export default ServerSidebar;
