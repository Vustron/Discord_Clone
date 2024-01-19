'use client';

import { format } from 'date-fns';
import { Member } from '@prisma/client';
import ChatItem from '@/components/chat/ChatItem';
import { Fragment, useRef, ElementRef } from 'react';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import { DATE_FORMAT } from '@/constants/dateFormat';
import { useChatSocket } from '@/hooks/useChatSocket';
import { MessageWithMemberWithProfile } from '@/types';
import ChatWelcome from '@/components/chat/ChatWelcome';
import { useChatScroll } from '@/hooks/useChatScroll';

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

	// init add key
	const addKey = `chat:${chatId}:messages`;

	// init update key
	const updateKey = `chat:${chatId}:messages:update`;

	// init refs
	const chatRef = useRef<ElementRef<'div'>>(null);
	const bottomRef = useRef<ElementRef<'div'>>(null);

	// init chat socket
	useChatSocket({
		queryKey,
		addKey,
		updateKey,
	});

	// init chat query
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
		});

	// init chat scroll
	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
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
		<div ref={chatRef} className='flex-1 flex flex-col overflow-y-auto'>
			{!hasNextPage && <div className='flex-1' />}
			{!hasNextPage && <ChatWelcome type={type} name={name} />}

			{hasNextPage && (
				<div className='flex justify-center'>
					{isFetchingNextPage ? (
						<Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className='text-zinc-500 hover:text-zinc-600
						dark:text-zinc-400 text-xs dark:hover:text-zinc-300*
						transition'
						>
							Load previous messages
						</button>
					)}
				</div>
			)}
			<div className='flex flex-col-reverse mt-auto'>
				{data?.pages?.map((group, index) => (
					<Fragment key={index}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								id={message.id}
								currentMember={member}
								member={message.member}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};

export default ChatMessages;
