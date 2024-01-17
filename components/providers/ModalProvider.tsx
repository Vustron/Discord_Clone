'use client';

import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { DeleteChannelModal } from '@/components/modals/DeleteChannelModal';
import { DeleteServerModal } from '@/components/modals/DeleteServerModal';
import { CreateServerModal } from '@/components/modals/CreateServerModal';
import { EditChannelModal } from '@/components/modals/EditChannelModal';
import { LeaveServerModal } from '@/components/modals/LeaveServerModal';
import { MessageFileModal } from '@/components/modals/MessageFileModal';
import { EditServerModal } from '@/components/modals/EditServerModal';
import { MembersModal } from '@/components/modals/MembersModal';
import { InviteModal } from '@/components/modals/InviteModal';
import useMounted from '@/hooks/useMounted';

export const ModalProvider = () => {
	// fix hydration error
	const isMounted = useMounted();

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
			<MembersModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<EditChannelModal />
			<MessageFileModal />
		</>
	);
};
