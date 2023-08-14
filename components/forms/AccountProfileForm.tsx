'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from '@/lib/validations/user';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { event2file, isBase64Image } from '@/lib/utils/file';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/api/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface IUserData {
  id: string;
  objectId?: string;
  username?: string;
  name?: string;
  bio?: string;
  image?: string;
} // TODO: move to models

interface AccountProfileFormProps {
  userData: IUserData;
  submitLabel: string;
}

export const AccountProfileForm = (props: AccountProfileFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing('media');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      profile_photo: props.userData?.image ?? '',
      name: props.userData?.name ?? '',
      username: props.userData?.username ?? '',
      bio: props.userData?.bio ?? '',
    },
  });

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    event.preventDefault();

    const transform = event2file(event);

    if (!transform) return;

    setFiles(Array.from(event.target.files!));

    setIsLoading(true);
    transform.fileReader.onload = async event => {
      const imageDataUrl = event.target?.result?.toString() || '';
      fieldChange(imageDataUrl);
      setIsLoading(false);
    };
  };

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    setIsLoading(true);

    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].fileUrl) values.profile_photo = imgRes[0].fileUrl;
    }

    await updateUser({
      username: values.username,
      name: values.name,
      path: pathname,
      image: values.profile_photo,
      userId: props.userData.id,
      bio: values.bio,
    });

    setIsLoading(false);

    pathname == '/profile/edit' ? router.back() : router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    objectFit="cover"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  lang="en"
                  placeholder="Upload a photo"
                  className="account-form_image-input !bg-transparent"
                  onChange={e => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_image-input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_image-input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  className="account-form_image-input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button data={{ isLoading }} type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </Form>
  );
};
