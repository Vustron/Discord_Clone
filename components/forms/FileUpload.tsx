'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';

interface FileUploadProps {
	endpoint: 'messageFile' | 'serverImage';
	value: string;
	onChange: (url?: string) => void;
}

// TODO: add toast
const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
	// file check
	const fileType = value?.split('.').pop();

	if (value && fileType !== 'pdf') {
		return (
			<div className='relative h-20 w-20'>
				<Image fill src={value} alt='upload' className='rounded-full' />
			</div>
		);
	}

	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
		/>
	);
};

export default FileUpload;
