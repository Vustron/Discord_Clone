import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { NextResponse } from 'next/server';
import { db } from '@/lib/actions/InitializeDB';

export async function DELETE(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		// fetch profile
		const profile = await fetchCurrentProfile();
		// init search params
		const { searchParams } = new URL(req.url);
		// fetch serverId
		const serverId = searchParams.get('serverId');

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!serverId) {
			return new NextResponse('Server ID Missing', { status: 401 });
		}

		if (!params.memberId) {
			return new NextResponse('Member ID Missing', { status: 401 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: 'asc',
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[MEMBERS_ID_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		// fetch profile
		const profile = await fetchCurrentProfile();
		// init search params
		const { searchParams } = new URL(req.url);
		// init roles
		const { role } = await req.json();
		// fetch serverId
		const serverId = searchParams.get('serverId');

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!serverId) {
			return new NextResponse('Server ID Missing', { status: 401 });
		}

		if (!params.memberId) {
			return new NextResponse('Member ID Missing', { status: 401 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: 'asc',
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[MEMBERS_ID_PATCH]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
