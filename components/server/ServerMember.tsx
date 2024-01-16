'use client';

import { cn } from '@/lib/utils';
import { roleChannelMap } from '@/constants/roles';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '@/components/shared/UserAvatar';
import { Member, Profile, Server } from '@prisma/client';

interface ServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
	// init params
	const params = useParams();

	// init router
	const router = useRouter();

	// init member icons
	const icon = roleChannelMap[member.role];

	// redirect on click
	const onClick = () => {
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
				params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
			)}
		>
			<UserAvatar
				src={member.profile.imageUrl}
				className='h-8 w-8 md:h-8 md:w-8'
			/>
			<p
				className={cn(
					'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
					params?.memberId === member.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white'
				)}
			>
				{member.profile.name}
			</p>
		</button>
	);
};

export default ServerMember;
