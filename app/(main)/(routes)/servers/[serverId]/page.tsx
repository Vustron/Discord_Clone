import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
	params: {
		serverId: string;
	};
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
	// fetch profile
	const profile = await fetchCurrentProfile();

	// redirect if there's no user
	if (!profile) {
		return redirectToSignIn();
	}

	// fetch server
	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: 'general',
				},
				orderBy: {
					createdAt: 'asc',
				},
			},
		},
	});

	// set initial channel
	const initialChannel = server?.channels[0];

	if (initialChannel?.name !== 'general') {
		return null;
	}

	return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
