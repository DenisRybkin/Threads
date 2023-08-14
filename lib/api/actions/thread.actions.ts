'use server';

import { Community } from '@/lib/api/models/community.model';
import { Thread } from '@/lib/api/models/thread.model';
import { User } from '@/lib/api/models/user.model';
import { OptionalPagingOptsOpts, PagingModel } from '@/lib/api/types/paging';
import { map2PagingDto, transformPagingOpts } from '@/lib/api/utils/paging';
import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';

interface ICreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: ICreateThreadParams) => {
  try {
    await connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
};

export const fetchPosts = async (
  pagingOpts?: OptionalPagingOptsOpts
): Promise<PagingModel<any>> => {
  await connectToDB();

  const paging = map2PagingDto(transformPagingOpts(pagingOpts));

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(paging.skip)
    .limit(paging.pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'community',
      model: Community,
    })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    });

  const totalItems = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();
  const hasNext = totalItems > paging.skip + posts.length;

  return {
    items: posts,
    ...transformPagingOpts(pagingOpts),
    totalItems,
    hasNext,
  };
};

export const fetchThreadById = async (threadId: string) => {
  await connectToDB();

  try {
    return await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) 
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec();
  } catch (err) {
    console.error('Error while fetching thread:', err);
    throw new Error('Unable to fetch thread');
  }
};

export const addCommentToThread = async (
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) => {
  await connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error('Thread not found');

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error('Error while adding comment:', err);
    throw new Error('Unable to add comment');
  }
};


export const fetchThreadsByUserId = async (userId: string) => {
  try {
    await connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: [
        {
          path: 'community',
          model: Community,
          select: 'name id image _id',
        },
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id',
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error('Error fetching user threads:', error);
    throw error;
  }
};
