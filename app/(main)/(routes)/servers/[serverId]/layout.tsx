import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import ServerSidebar from '@/components/shared/ServerSidebar';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { serverId: string };
}) => {
	// fetch current user profile
	const profile = await fetchCurrentProfile();

	// if there's no profile redirect to sign-in
	if (!profile) {
		return redirectToSignIn();
	}

	// find the server id and the user id if the user belongs to that server
	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	// if not redirect to home
	if (!server) {
		return redirect('/');
	}

	return (
		<div className='h-full'>
			<div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
				<ServerSidebar serverId={params.serverId} />
			</div>

			<main className='h-full md:pl-60'>{children}</main>
		</div>
	);
};

export default ServerIdLayout;
