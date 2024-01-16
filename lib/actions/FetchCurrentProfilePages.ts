import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/actions/InitializeDB';
import { NextApiRequest } from 'next';

export const fetchCurrentProfilePages = async (req: NextApiRequest) => {
	// init auth
	const { userId } = getAuth(req);

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
