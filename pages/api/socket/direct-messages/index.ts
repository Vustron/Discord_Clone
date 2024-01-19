import { fetchCurrentProfilePages } from '@/lib/actions/FetchCurrentProfilePages';
import { NextApiResponseServerIo } from '@/types';
import { db } from '@/lib/actions/InitializeDB';
import { NextApiRequest } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// fetch profile
		const profile = await fetchCurrentProfilePages(req);

		// fetch content
		const { content, fileUrl } = req.body;

		// fetch id
		const { conversationId } = req.query;

		// Throw an error if there's no user
		if (!profile) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Throw an error if the server id is empty
		if (!conversationId) {
			return res.status(401).json({ error: 'Conversation ID Missing' });
		}

		// Throw an error if the content is empty
		if (!content) {
			return res.status(401).json({ error: 'Content Missing' });
		}

		const conversation = await db.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});

		if (!conversation) {
			return res.status(404).json({ message: 'Conversation not found' });
		}

		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo;

		if (!member) {
			return res.status(404).json({ message: 'Member not found' });
		}

		const message = await db.directMessage.create({
			data: {
				content,
				fileUrl,
				conversationId: conversationId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		const channelKey = `chat:${conversationId}:messages`;

		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log('[DIRECT_MESSAGES_POST]', error);
		return res.status(500).json({ message: 'Internal Error' });
	}
}
