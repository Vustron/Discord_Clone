import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

// init message batches
const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
	try {
		// fetch user profile from database
		const profile = await fetchCurrentProfile();

		// init search params
		const { searchParams } = new URL(req.url);

		// init cursor params
		const cursor = searchParams.get('cursor');

		// init channel id
		const channelId = searchParams.get('channelId');

		// if there's no profile throw an error
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// if there's no profile throw an error
		if (!channelId) {
			return new NextResponse('Channel ID is missing', { status: 400 });
		}

		let messages: Message[] = [];

		if (cursor) {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		} else {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				where: {
					channelId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		}

		let nextCursor = null;

		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id;
		}

		return NextResponse.json({
			items: messages,
			nextCursor,
		});
	} catch (error) {
		console.log('[MESSAGES_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
