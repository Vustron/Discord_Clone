import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { DirectMessage } from '@prisma/client';
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
		const conversationId = searchParams.get('conversationId');

		// if there's no profile throw an error
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// if there's no profile throw an error
		if (!conversationId) {
			return new NextResponse('Conversation ID is missing', { status: 400 });
		}

		let messages: DirectMessage[] = [];

		if (cursor) {
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
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
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				where: {
					conversationId,
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
		console.log('[DIRECT_MESSAGES_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
