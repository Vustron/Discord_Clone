import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import ChatHeader from '@/components/chat/ChatHeader';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { redirect } from 'next/navigation';

interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	// fetch profile
	const profile = await fetchCurrentProfile();

	// redirect if there's no user
	if (!profile) {
		return redirectToSignIn();
	}

	// fetch channel
	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		},
	});

	// fetch channel members
	const members = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
	});

	if (!channel || !members) {
		redirect('/');
	}

	return (
		<div
			className='bg-white dark:bg-[#313338] flex flex-col
		h-full'
		>
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type='channel'
			/>
		</div>
	);
};

export default ChannelIdPage;
