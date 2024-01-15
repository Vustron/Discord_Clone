'use client';

import { Channel, MemberRole, Server } from '@prisma/client';

interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
	return <div>Server channel</div>;
};

export default ServerChannel;
