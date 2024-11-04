import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull } from 'graphql';

import { UUIDType } from './types/uuid.js';
import { UserType, CreateUserInput, ChangeUserInput } from './types/user.js';
import { ProfileType, CreateProfileInput, ChangeProfileInput } from './types/profile.js';
import { PostType, CreatePostInput, ChangePostInput } from './types/post.js';
import { Context, User, Profile, Post } from './interfaces/interfaces.js';

const handleDelete = async (deleteFunction: () => Promise<void>): Promise<boolean> => {
  try {
    await deleteFunction();
    return true;
  } catch {
    return false;
  }
};

export const mutations = new GraphQLObjectType<unknown, Context>({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: { dto: { type: CreateUserInput } },
      resolve: async (root, { dto }: { dto: Pick<User, 'name' | 'balance'> }, context) =>
        context.prisma.user.create({ data: dto }),
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInput },
      },
      resolve: async (
        root,
        { id, dto }: { id: string; dto: Pick<User, 'name' | 'balance'> },
        context,
      ) => context.prisma.user.update({ where: { id }, data: dto }),
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (root, { id }: { id: string }, context) =>
        handleDelete(() => context.prisma.user.delete({ where: { id } }).then(() => {})),
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (root, { dto }: { dto: Omit<Profile, 'id'> }, context) =>
        context.prisma.profile.create({ data: dto }),
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (
        root,
        { id, dto }: { id: string; dto: Omit<Profile, 'id' | 'userId'> },
        context,
      ) => context.prisma.profile.update({ where: { id }, data: dto }),
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (root, { id }: { id: string }, context) =>
        handleDelete(() =>
          context.prisma.profile.delete({ where: { id } }).then(() => {}),
        ),
    },
    createPost: {
      type: PostType,
      args: { dto: { type: CreatePostInput } },
      resolve: async (root, { dto }: { dto: Omit<Post, 'id'> }, context) =>
        context.prisma.post.create({ data: dto }),
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInput },
      },
      resolve: async (
        root,
        { id, dto }: { id: string; dto: Omit<Post, 'id' | 'authorId'> },
        context,
      ) => context.prisma.post.update({ where: { id }, data: dto }),
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (root, { id }: { id: string }, context) =>
        handleDelete(() => context.prisma.post.delete({ where: { id } }).then(() => {})),
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        root,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        await context.prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return context.prisma.user.findUnique({ where: { id: userId } });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (
        root,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) =>
        handleDelete(() =>
          context.prisma.subscribersOnAuthors
            .delete({
              where: { subscriberId_authorId: { subscriberId: userId, authorId } },
            })
            .then(() => {}),
        ),
    },
  },
});
