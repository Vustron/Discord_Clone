import { fetchCurrentProfilePages } from '@/lib/actions/FetchCurrentProfilePages';
import { NextApiResponseServerIo } from '@/types';
import { db } from '@/lib/actions/InitializeDB';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== 'DELETE' && req.method !== 'PATCH') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// fetch profile
		const profile = await fetchCurrentProfilePages(req);

		// fetch id
		const { directMessageId, conversationId } = req.query;

		// fetch content
		const { content } = req.body;

		// Throw an error if there's no user
		if (!profile) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Throw an error if the server id is empty
		if (!conversationId) {
			return res.status(401).json({ error: 'Conversation ID Missing' });
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

		// Throw an error if the member is not found
		if (!member) {
			return res.status(404).json({ error: 'Member not found' });
		}

		let directMessage = await db.directMessage.findFirst({
			where: {
				id: directMessageId as string,
				conversationId: conversationId as string,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		// Throw an error if the message is not found
		if (!directMessage || directMessage.deleted) {
			return res.status(404).json({ error: 'Message not found' });
		}

		const isMessageOwner = directMessage.memberId === member.id;
		const isAdmin = member.role === MemberRole.ADMIN;
		const isModerator = member.role === MemberRole.MODERATOR;
		const canModify = isMessageOwner || isAdmin || isModerator;

		// Throw an error if the message can't be modified
		if (!canModify) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		if (req.method === 'DELETE') {
			directMessage = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					fileUrl: null,
					content: 'This message has been deleted',
					deleted: true,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
			});
		}

		if (req.method === 'PATCH') {
			if (!isMessageOwner) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			directMessage = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					content,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
			});
		}

		const updateKey = `chat:${conversationId}:messages:update`;

		res?.socket?.server?.io?.emit(updateKey, directMessage);

		return res.status(200).json(directMessage);
	} catch (error) {
		console.log('[DIRECT_MESSAGE_ID]', error);
		return res.status(500).json({ message: 'Internal Error' });
	}
}
