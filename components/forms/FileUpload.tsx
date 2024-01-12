'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/lib/validation';
import { UploadDropzone } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';

interface FileUploadProps {
	endpoint: 'messageFile' | 'serverImage';
	value: string;
	onChange: (url?: string) => void;
}

// TODO: add toast
const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
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
