import './globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from '@/components/providers/QueryProvider';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SocketProvider } from '@/components/providers/SocketProvider';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: "Discordn't",
	description: 'A discord clone made by Vustron',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						storageKey='discord-theme'
					>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
