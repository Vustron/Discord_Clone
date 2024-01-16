'use client';

import { ActionTooltip } from '@/components/ui/action-tooltip';
import { ModalType, useModal } from '@/hooks/useModalStore';
import { Channel, MemberRole, Server } from '@prisma/client';
import { iconChannelMap } from '@/constants/channelType';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Lock, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
	// init modal
	const { onOpen } = useModal();

	// init params
	const params = useParams();

	// init router
	const router = useRouter();

	// init icons
	const Icon = iconChannelMap[channel.type];

	// redirect on click
	const onClick = async () => {
		router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
	};

	const onAction = (e: React.MouseEvent, action: ModalType) => {
		e.stopPropagation();
		onOpen(action, { channel, server });
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
				params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
			)}
		>
			<Icon className='flex-shrink-0 w-5 h-5 text-zinc-700/10 dark:text-zinc-400' />
			<p
				className={cn(
					'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
					params?.channelId === channel.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white'
				)}
			>
				{channel.name}
			</p>

			{channel.name !== 'general' &&
				channel.name !== 'General' &&
				role !== MemberRole.GUEST && (
					<div className='ml-auto flex items-center gap-x-2'>
						<ActionTooltip label='Edit'>
							<Edit
								onClick={(e) => onAction(e, 'editChannel')}
								className='hidden group-hover:block w-4 h-4 text-zinc-500
                            hover:text-yellow-600 dark:text-zinc-400 dark:hover:text-yellow-300
                            transition'
							/>
						</ActionTooltip>
						<ActionTooltip label='Delete'>
							<Trash
								onClick={(e) => onAction(e, 'deleteChannel')}
								className='hidden group-hover:block w-4 h-4 text-zinc-500
                            hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-600
                            transition'
							/>
						</ActionTooltip>
					</div>
				)}

			{channel.name === 'general' && (
				<Lock className='ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400' />
			)}
		</button>
	);
};

export default ServerChannel;
