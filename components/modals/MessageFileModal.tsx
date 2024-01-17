'use client';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formMessageFileSchema } from '@/lib/validation';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import useMounted from '@/hooks/useMounted';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/forms/FileUpload';
import { useModal } from '@/hooks/useModalStore';

export const MessageFileModal = () => {
	// init modal
	const { isOpen, onClose, type, data } = useModal();
	const isModalOpen = isOpen && type === 'messageFile';

	// extract url
	const { apiUrl, query } = data;

	// fix hydration error
	const isMounted = useMounted();

	// init router
	const router = useRouter();

	// init form
	const form = useForm<z.infer<typeof formMessageFileSchema>>({
		resolver: zodResolver(formMessageFileSchema),
		defaultValues: {
			fileUrl: '',
		},
	});

	// init form state
	const isLoading = form.formState.isSubmitting;

	// submit function
	const onSubmit = async (values: z.infer<typeof formMessageFileSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || '',
				query,
			});

			await axios.post(url, {
				...values,
				content: values.fileUrl,
			});

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	if (!isMounted) {
		return null;
	}

	// handle close
	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Add an Attachment
					</DialogTitle>

					<DialogDescription className='text-center text-zinc-500'>
						Send a file as a message
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<div className='space-y-8 px-6'>
							<div className='flex items-center justify-center text-center'>
								<FormField
									control={form.control}
									name='fileUrl'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint='messageFile'
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button variant='primary' disabled={isLoading} className='w-full'>
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
