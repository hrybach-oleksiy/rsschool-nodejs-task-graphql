import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

import { User, Post, Member } from './interfaces/interfaces.js';

const createDataLoader = <T>(
  batchLoadFn: (ids: readonly string[], prisma: PrismaClient) => Promise<T[]>,
  keyFn: (item: T) => string,
  prisma: PrismaClient,
) => {
  return new DataLoader(async (ids: readonly string[]) => {
    const items = await batchLoadFn(ids, prisma);
    const itemsMap = new Map(items.map((item) => [keyFn(item), item]));
    return ids.map((id) => itemsMap.get(id) || null);
  });
};

export const initDataLoaders = (prisma: PrismaClient) => ({
  userLoader: createDataLoader<User>(
    async (ids, prisma) =>
      await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
        include: {
          userSubscribedTo: true,
          subscribedToUser: true,
        },
      }),
    (user) => user.id,
    prisma,
  ),

  profileLoader: createDataLoader(
    async (ids, prisma) =>
      await prisma.profile.findMany({
        where: { userId: { in: ids as string[] } },
      }),
    (profile) => profile.userId,
    prisma,
  ),

  postLoader: new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    const postsMap = new Map<string, Post[]>();
    posts.forEach((post) => {
      if (!postsMap.has(post.authorId)) postsMap.set(post.authorId, []);
      postsMap.get(post.authorId)?.push(post);
    });

    return ids.map((id) => postsMap.get(id) || []);
  }),

  memberLoader: createDataLoader<Member>(
    async (ids, prisma) =>
      await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      }),
    (memberType) => memberType.id,
    prisma,
  ),
});
