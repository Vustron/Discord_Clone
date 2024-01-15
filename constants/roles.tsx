import { MemberRole } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
	ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
};

export const roleChannelMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />
	),
	[MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
};
