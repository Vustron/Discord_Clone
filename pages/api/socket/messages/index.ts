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
		const { serverId, channelId } = req.query;

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

		// Throw an error if the content is empty
		if (!content) {
			return res.status(401).json({ error: 'Content Missing' });
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

		if (!server) {
			return res.status(404).json({ message: 'Server not found' });
		}

		const channel = await db.channel.findFirst({
			where: {
				id: channelId as string,
				serverId: serverId as string,
			},
		});

		if (!channel) {
			return res.status(404).json({ message: 'Channel not found' });
		}

		const member = server.members.find(
			(member) => member.profileId === profile.id
		);

		if (!member) {
			return res.status(404).json({ message: 'Member not found' });
		}

		const message = await db.message.create({
			data: {
				content,
				fileUrl,
				channelId: channelId as string,
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

		const channelKey = `chat:${channelId}:messages`;

		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log('[MESSAGES_POST]', error);
		return res.status(500).json({ message: 'Internal Error' });
	}
}
