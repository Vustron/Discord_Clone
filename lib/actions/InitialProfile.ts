import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/actions/InitializeDB';

export const initialProfile = async () => {
	// init current user
	const user = await currentUser();

	// redirect if there's no user
	if (!user) {
		return redirectToSignIn();
	}

	// if there's one then fetch profile of the current user in the database
	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	// then return the profile info of the current user
	if (profile) {
		return profile;
	}

	// if the current user is a new one then create a new profile on the database
	const newProfile = await db.profile.create({
		data: {
			userId: user.id,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
		},
	});

	// then return the newly created profile of the user
	return newProfile;
};
