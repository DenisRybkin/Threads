'use server';

import { connectToDB } from '@/lib/mongoose';
import { User } from '@/lib/api/models/user.model';
import { revalidatePath } from 'next/cache';
import { Community } from '@/lib/api/models/community.model';
import { FilterQuery, SortOrder } from 'mongoose';
import { OptionalPagingOptsOpts } from '@/lib/api/types/paging';
import { map2PagingDto, transformPagingOpts } from '@/lib/api/utils/paging';
import { Thread } from '@/lib/api/models/thread.model';

interface IUpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: 'communities',
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export const updateUser = async (dto: IUpdateUserParams): Promise<void> => {
  await connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: dto.userId },
      {
        username: dto.username.toLowerCase(),
        name: dto.name,
        bio: dto.bio,
        image: dto.image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (dto.path == 'profile/edit') revalidatePath(dto.path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to create/update user: ${error?.message}`);
  }
};

export const fetchUsers = async ({
  userId,
  searchString = '',
  sortBy = 'desc',
  pagingOpts,
}: {
  userId: string;
  searchString?: string;
  sortBy?: SortOrder;
  pagingOpts?: OptionalPagingOptsOpts;
}) => {
  try {
    await connectToDB();

    const paging = map2PagingDto(transformPagingOpts(pagingOpts));

    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() != '')
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(paging.skip)
      .limit(paging.pageSize);

    const totalItems = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const hasNext = totalItems > paging.skip + users.length;

    return {
      items: users,
      ...transformPagingOpts(pagingOpts),
      totalItems,
      hasNext,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export async function getActivity(userId: string) {
  try {
    await connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    return await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });
  } catch (error) {
    console.error('Error fetching replies: ', error);
    throw error;
  }
}
