import { ChannelType } from '@prisma/client';
import * as z from 'zod';

export const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Server name is required',
	}),
	imageUrl: z.string().min(1, {
		message: 'Server image is required',
	}),
});

export const formChannelSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: 'Channel name is required',
		})
		.refine((name) => name !== 'General', {
			message: "Channel name cannot be 'General'",
		})
		.refine((name) => name !== 'general', {
			message: "Channel name cannot be 'general'",
		}),
	type: z.nativeEnum(ChannelType),
});

export const formChatInputSchema = z.object({
	content: z.string().min(1),
});

export const formMessageFileSchema = z.object({
	fileUrl: z.string().min(1, {
		message: 'Attachment is required',
	}),
});

export const formChatItemSchema = z.object({
	content: z.string().min(1),
});
