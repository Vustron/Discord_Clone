import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		// fetch user profile from database
		const profile = await fetchCurrentProfile();

		// if there's no profile throw an error
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// if there's no serverId throw an error
		if (!params.serverId) {
			return new NextResponse('Server ID missing', { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: {
					not: profile.id,
				},
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[SERVER_ID_LEAVE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
