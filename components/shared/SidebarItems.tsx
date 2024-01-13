'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { ActionTooltip } from '@/components/ui/action-tooltip';

interface SidebarItemsProps {
	id: string;
	imageUrl: string;
	name: string;
}

const SidebarItems = ({ id, imageUrl, name }: SidebarItemsProps) => {
	// init params
	const params = useParams();

	// init router
	const router = useRouter();

	// push to the server on click based on id
	const onClick = () => {
		router.push(`/servers/${id}`);
	};

	return (
		<div>
			<ActionTooltip side='right' align='center' label={name}>
				<button onClick={onClick} className='group relative flex items-center'>
					<div
						className={cn(
							'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
							params?.serverId !== id && 'group-hover:h-[20px]',
							params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
						)}
					/>

					<div
						className={cn(
							'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
							params?.serverId === id &&
								'bg-primary/10 text-primary rounded-[16px]'
						)}
					>
						<Image fill src={imageUrl} alt='Channel' />
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
};

export default SidebarItems;
