'use client';

import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogFooter,
	DialogContent,
	DialogDescription,
} from '@/components/ui/dialog';

import { useModal } from '@/hooks/useModalStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import qs from 'query-string';
import axios from 'axios';

export const DeleteChannelModal = () => {
	const [isLoading, setIsLoading] = useState(false);

	// init use Modal
	const { isOpen, onClose, type, data } = useModal();
	const isModalOpen = isOpen && type === 'deleteChannel';

	// init router
	const router = useRouter();

	// extract server data
	const { server, channel } = data;

	// init delete channel
	const onClick = async () => {
		try {
			setIsLoading(true);

			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id,
				},
			});

			await axios.delete(url);

			onClose();
			router.refresh();
			router.push(`/servers/${server?.id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Delete Channel
					</DialogTitle>

					<DialogDescription className='text-center text-zinc-500'>
						Are you sure you want to do this? <br />
						<span className='font-semibold text-indigo-500'>
							#{channel?.name}
						</span>{' '}
						will be permanently deleted.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className='bg-gray-100 px-6 py-4'>
					<div className='flex items-center justify-between w-full'>
						<Button
							className='hover:bg-red-700'
							variant='primary'
							disabled={isLoading}
							onClick={onClick}
						>
							Confirm
						</Button>
						<Button variant='ghost' disabled={isLoading} onClick={onClose}>
							Cancel
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
