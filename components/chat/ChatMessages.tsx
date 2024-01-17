'use client';

import { Fragment } from 'react';
import { Member } from '@prisma/client';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatWelcome from '@/components/chat/ChatWelcome';
import { MessageWithMemberWithProfile } from '@/types';

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
	type: 'channel' | 'conversation';
}

const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}: ChatMessagesProps) => {
	// init query key
	const queryKey = `chat:${chatId}`;

	// init chat query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
		});

	if (status === 'loading') {
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
				<p className='text-xs text-zinc-500 dark:text-zinc-400'>
					Loading messages...
				</p>
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
				<p className='text-xs text-zinc-500 dark:text-zinc-400'>
					Something went wrong!
				</p>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col overflow-y-auto'>
			<div className='flex-1' />
			<ChatWelcome type={type} name={name} />

			<div className='flex flex-col-reverse mt-auto'>
				{data?.pages?.map((group, index) => (
					<Fragment key={index}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<div key={message.id}>{message.content}</div>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default ChatMessages;
