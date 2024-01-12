import { auth } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';

export const fetchCurrentProfile = async () => {
	// init auth
	const { userId } = auth();

	// if there's no id return nothing
	if (!userId) {
		return null;
	}

	// else find the user profile id
	const profile = await db.profile.findUnique({
		where: {
			userId,
		},
	});

	// then return the user profile info
	return profile;
};
