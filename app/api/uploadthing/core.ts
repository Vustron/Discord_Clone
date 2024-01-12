import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs';

// init uploadthing
const f = createUploadthing();

// init auth
const handleAuth = () => {
	const { userId } = auth();

	if (!userId) throw new Error('Unauthorized');
	return { userId: userId };
};

export const ourFileRouter = {
	// upload server image
	serverImage: f({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1,
		},
	})
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),

	// upload message files
	messageFile: f(['image', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
