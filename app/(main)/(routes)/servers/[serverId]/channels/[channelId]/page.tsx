import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import ChatMessages from '@/components/chat/ChatMessages';
import { MediaRoom } from '@/components/shared/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { ChannelType } from '@prisma/client';
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

			{channel.type === ChannelType.TEXT && (
				<>
					<ChatMessages
						member={members}
						name={channel.name}
						chatId={channel.id}
						type='channel'
						apiUrl='/api/messages'
						socketUrl='/api/socket/messages'
						socketQuery={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
						paramKey='channelId'
						paramValue={channel.id}
					/>

					<ChatInput
						name={channel.name}
						type='channel'
						apiUrl='/api/socket/messages'
						query={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
					/>
				</>
			)}

			{channel.type === ChannelType.AUDIO && (
				<MediaRoom chatId={channel.id} video={false} audio={true} />
			)}

			{channel.type === ChannelType.VIDEO && (
				<MediaRoom chatId={channel.id} video={true} audio={true} />
			)}
		</div>
	);
};

export default ChannelIdPage;
