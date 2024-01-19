import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { getOrCreateConversation } from '@/lib/actions/conversation';
import ChatMessages from '@/components/chat/ChatMessages';
import { MediaRoom } from '@/components/shared/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { redirect } from 'next/navigation';


interface MemberIdPageProps {
	params: {
		memberId: string;
		serverId: string;
	};
	searchParams: {
		video?: boolean;
	};
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
	// fetch profile
	const profile = await fetchCurrentProfile();

	// redirect if there's no user
	if (!profile) {
		return redirectToSignIn();
	}

	// fetch member
	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	// redirect if there's no member
	if (!currentMember) {
		return redirect('/');
	}

	// fetch conversation
	const conversation = await getOrCreateConversation(
		currentMember.id,
		params.memberId
	);

	// redirect if there's an error
	if (!conversation) {
		return redirect(`/servers/${params.serverId}`);
	}

	// extract conversation data
	const { memberOne, memberTwo } = conversation;

	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={params.serverId}
				type='conversation'
			/>

			{searchParams.video && (
				<MediaRoom chatId={conversation.id} video={true} audio={true} />
			)}

			{!searchParams.video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type='conversation'
						apiUrl='/api/direct-messages'
						paramKey='conversationId'
						paramValue={conversation.id}
						socketUrl='/api/socket/direct-messages'
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>

					<ChatInput
						name={otherMember.profile.name}
						type='conversation'
						apiUrl='/api/socket/direct-messages'
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	);
};

export default MemberIdPage;
