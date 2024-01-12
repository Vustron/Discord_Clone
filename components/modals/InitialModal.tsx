'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import useMounted from '@/hooks/useMounted';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const InitialModal = () => {
	// fix hydration error
	const isMounted = useMounted();

	// init form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			imageUrl: '',
		},
	});

	// init form state
	const isLoading = form.formState.isSubmitting;

	// submit function
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open={true}>
			<DialogContent className='bg-white text-black p-0 overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Customize your server
					</DialogTitle>

					<DialogDescription className='text-center text-zinc-500'>
						Give your server details with a name and an image. You can always
						change it later.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<div className='space-y-8 px-6'>
							<div className='flex items-center justify-center text-center'>
								<p>Todo image upload</p>
							</div>

							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
											Server Name
										</FormLabel>

										<FormControl>
											<Input
												disabled={isLoading}
												className='
												bg-zinc-300/50 
												border-0 
												focus-visible:ring-0 
												text-black 
												focus-visible:ring-offset-0
												'
												placeholder='Enter server name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button variant='primary' disabled={isLoading}>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
