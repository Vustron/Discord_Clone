import { fetchCurrentProfile } from '@/lib/actions/FetchCurrentProfile';
import { db } from '@/lib/actions/InitializeDB';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// POST REST API
export async function POST(req: Request) {
	try {
		// init name and imageUrl
		const { name, imageUrl } = await req.json();
		// fetch user profile from database
		const profile = await fetchCurrentProfile();

		// if there's no profile throw an error
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const server = await db.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [
						{
							name: 'general',
							profileId: profile.id,
						},
					],
				},
				members: {
					create: [
						{
							profileId: profile.id,
							role: MemberRole.ADMIN,
						},
					],
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[SERVER_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
