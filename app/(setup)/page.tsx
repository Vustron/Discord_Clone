import { redirect } from 'next/navigation';
import { db } from '@/lib/actions/InitializeDB';
import { InitialModal } from '@/components/modals/InitialModal';
import { initialProfile } from '@/lib/actions/InitialProfile';

const SetupPage = async () => {
	// fetch current user profile info
	const profile = await initialProfile();

	// fetch profile id to find servers the user belongs to
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	// redirect to the server where the user belongs to
	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return (
		<div>
			<InitialModal />
		</div>
	);
};

export default SetupPage;
