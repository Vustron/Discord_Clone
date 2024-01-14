'use client';

import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { LeaverServerModal } from '@/components/modals/LeaverServerModal';
import { CreateServerModal } from '@/components/modals/CreateServerModal';
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
			<LeaverServerModal />
		</>
	);
};
