'use client';

import { CreateServerModal } from '@/components/modals/CreateServerModal';
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
		</>
	);
};
