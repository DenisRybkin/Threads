import * as z from 'zod';

export const ThreadSchema = z.object({
  thread: z.string().nonempty().min(3, { message: 'Minimum 3 characters' }),
  accountId: z.string(),
});

export const CommentThreadSchema = z.object({
  thread: z.string().nonempty().min(3, { message: 'Minimum 3 characters' }),
});
