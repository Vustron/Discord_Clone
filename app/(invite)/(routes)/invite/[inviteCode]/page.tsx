import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
	params: {
		inviteCode: string;
	};
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
	// fetch user profile from database
	const profile = await fetchCurrentProfile();

	// redirect if there's no user
	if (!profile) {
		return redirectToSignIn();
	}

	// return home if there's no invite code
	if (!params.inviteCode) {
		return redirect('/');
	}

	// Check if the user is already in the server
	const existingServer = await db.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	// redirect to the existing server
	if (existingServer) return redirect(`/servers/${existingServer.id}`);

	const server = await db.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	});

	return <div>Invite Page</div>;
};

export default InviteCodePage;
