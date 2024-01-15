import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import SidebarActions from '@/components/shared/SidebarActions';
import { ModeToggle } from '@/components/shared/ThemeToggle';
import SidebarItems from '@/components/shared/SidebarItems';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/actions/InitializeDB';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const Sidebar = async () => {
	// fetch user profile
	const profile = await fetchCurrentProfile();

	// redirect to login if there's no user profile
	if (!profile) {
		return redirect('/');
	}

	// fetch profile id to find servers the user belongs to
	const servers = await db.server.findMany({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	return (
		<div
			className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3
		bg-[#E3E5E8]'
		>
			<SidebarActions />

			<Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />

			<ScrollArea className='flex-1 w-full'>
				{servers.map((server) => (
					<div key={server.id} className='mb-4'>
						<SidebarItems
							id={server.id}
							name={server.name}
							imageUrl={server.imageUrl}
						/>
					</div>
				))}
			</ScrollArea>

			<div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
				<ModeToggle />
				<UserButton
					afterSignOutUrl='/'
					appearance={{
						elements: {
							avatarBox: 'h-[48px] w-[48px]',
						},
					}}
				/>
			</div>
		</div>
	);
};

export default Sidebar;
