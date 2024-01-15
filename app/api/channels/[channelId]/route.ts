import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(
	req: Request,
	{ params }: { params: { channelId: string } }
) {
	try {
		// fetch user profile from database
		const profile = await fetchCurrentProfile();
		// init search params
		const { searchParams } = new URL(req.url);
		// fetch serverId
		const serverId = searchParams.get('serverId');

		// if there's no profile throw an error
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// if there's no serverId throw an error
		if (!serverId) {
			return new NextResponse('Server ID Missing', { status: 400 });
		}

		// if there's no channelId throw an error
		if (!params.channelId) {
			return new NextResponse('Channel ID Missing', { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						id: params.channelId,
						name: {
							not: 'general' || 'General',
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[CHANNEL_ID_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
