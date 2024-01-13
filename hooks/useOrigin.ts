import useMounted from '@/hooks/useMounted';

export const useOrigin = () => {
	// fix hydration error
	const isMounted = useMounted();

	if (!isMounted) {
		return null;
	}

	const origin =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin
			: '';

	return origin;
};
