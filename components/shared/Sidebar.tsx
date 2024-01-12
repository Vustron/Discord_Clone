import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import SidebarActions from './SidebarActions';
import { redirect } from 'next/navigation';

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
		<div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3'>
			<SidebarActions />
		</div>
	);
};

export default Sidebar;
