import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

// POST REST API
export async function POST(req: Request) {
	try {
		// fetch user profile from database
		const profile = await fetchCurrentProfile();
		// init name and imageUrl
		const { name, type } = await req.json();
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

		if (name === 'general' || name === 'General') {
			return new NextResponse("Name cannot be 'general' or 'General'", {
				status: 400,
			});
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
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[SERVER_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
