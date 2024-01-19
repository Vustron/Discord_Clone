'use client';

import qs from 'query-string';
import { Video, VideoOff } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/action-tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ChatVideo = () => {
	// init pathname
	const pathname = usePathname();

	// init router
	const router = useRouter();

	// init params
	const searchParams = useSearchParams();

	// init video
	const isVideo = searchParams?.get('video');

	// init video function
	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname || '',
				query: {
					video: isVideo ? undefined : true,
				},
			},
			{ skipNull: true }
		);

        router.push(url)
	};

	const Icon = isVideo ? VideoOff : Video;
	const tooltipLabel = isVideo ? 'End Video Call' : 'Start Video Call';

	return (
		<ActionTooltip side='bottom' label={tooltipLabel}>
			<button onClick={onClick} className='hover:opacity-75 transition mr-4'>
				<Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
			</button>
		</ActionTooltip>
	);
};

export default ChatVideo;
