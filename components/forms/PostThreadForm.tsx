'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ThreadSchema } from '@/lib/validations/thread';
import { zodResolver } from '@hookform/resolvers/zod';
import { createThread } from '@/lib/api/actions/thread.actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PostThreadFormProps {
  userId: string;
}

export const PostThreadForm = (props: PostThreadFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ThreadSchema>>({
    resolver: zodResolver(ThreadSchema),
    defaultValues: {
      thread: '',
      accountId: props.userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadSchema>) => {
    setIsLoading(true);
    await createThread({
      text: values.thread,
      author: props.userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    setIsLoading(false);
    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" data={{ isLoading }} variant="primary">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};
