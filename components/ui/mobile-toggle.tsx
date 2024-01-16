import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ServerSidebar from '@/components/server/ServerSidebar';
import Sidebar from '@/components/shared/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className='md:hidden'>
					<Menu />
				</Button>
			</SheetTrigger>

			<SheetContent side='left' className='p-0 flex gap-0'>
				<div className='w-[72px]'>
					<Sidebar />
				</div>
				<ServerSidebar serverId={serverId} />
			</SheetContent>
		</Sheet>
	);
};

export default MobileToggle;
