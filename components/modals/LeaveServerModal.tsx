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
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const LeaveServerModal = () => {
	const [isLoading, setIsLoading] = useState(false);

	// init use Modal
	const { isOpen, onClose, type, data } = useModal();
	const isModalOpen = isOpen && type === 'leaveServer';

	// init router
	const router = useRouter();

	// extract server data
	const { server } = data;

	// init leave server
	const onClick = async () => {
		try {
			setIsLoading(true);

			await axios.patch(`/api/servers/${server?.id}/leave`);

			onClose();
			router.refresh();
			router.push('/');
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
						Leave Server
					</DialogTitle>

					<DialogDescription className='text-center text-zinc-500'>
						Are you sure you want to leave{' '}
						<span className='font-semibold text-indigo-500'>
							{server?.name}
						</span>{' '}
						?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className='bg-gray-100 px-6 py-4'>
					<div className='flex items-center justify-between w-full'>
						<Button variant='primary' disabled={isLoading} onClick={onClick}>
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
