import { fetchCurrentProfilePages } from '@/lib/actions/FetchCurrentProfilePages';
import { NextApiResponseServerIo } from '@/types';
import { db } from '@/lib/actions/InitializeDB';
import { NextApiRequest } from 'next';
import { MemberRole } from '@prisma/client';

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
		const { messageId, serverId, channelId } = req.query;

		// fetch content
		const { content } = req.body;

		// Throw an error if there's no user
		if (!profile) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Throw an error if the server id is empty
		if (!serverId) {
			return res.status(401).json({ error: 'Server ID Missing' });
		}

		// Throw an error if the channel id is empty
		if (!channelId) {
			return res.status(401).json({ error: 'Channel ID Missing' });
		}

		const server = await db.server.findFirst({
			where: {
				id: serverId as string,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			include: {
				members: true,
			},
		});

		// Throw an error if the server is not found
		if (!server) {
			return res.status(404).json({ error: 'Server not found' });
		}

		const channel = await db.channel.findFirst({
			where: {
				id: channelId as string,
				serverId: serverId as string,
			},
		});

		// Throw an error if the channel is not found
		if (!channel) {
			return res.status(404).json({ error: 'Channel not found' });
		}

		const member = server.members.find(
			(member) => member.profileId === profile.id
		);

		// Throw an error if the member is not found
		if (!member) {
			return res.status(404).json({ error: 'Member not found' });
		}

		let message = await db.message.findFirst({
			where: {
				id: messageId as string,
				channelId: channelId as string,
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
		if (!message || message.deleted) {
			return res.status(404).json({ error: 'Message not found' });
		}

		const isMessageOwner = message.memberId === member.id;
		const isAdmin = member.role === MemberRole.ADMIN;
		const isModerator = member.role === MemberRole.MODERATOR;
		const canModify = isMessageOwner || isAdmin || isModerator;

		// Throw an error if the message can't be modified
		if (!canModify) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		if (req.method === 'DELETE') {
			message = await db.message.update({
				where: {
					id: messageId as string,
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

			message = await db.message.update({
				where: {
					id: messageId as string,
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

		const updateKey = `chat:${channelId}:messages:update`;

		res?.socket?.server?.io?.emit(updateKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log('[MESSAGE_ID]', error);
		return res.status(500).json({ message: 'Internal Error' });
	}
}
