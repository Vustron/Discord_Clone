import { ModeToggle } from '@/components/shared/ThemeToggle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
	return (
		<div>
			<UserButton afterSignOutUrl='/' />
			<ModeToggle />
		</div>
	);
}
