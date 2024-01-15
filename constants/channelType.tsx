import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

export const iconMap = {
	[ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
	[ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
	[ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

export const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className='text-indigo-500 mr-2 h-4 w-4' />
	),
	[MemberRole.ADMIN]: <ShieldAlert className='text-rose-500 mr-2 h-4 w-4' />,
};

export const iconChannelMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
};
