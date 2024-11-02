import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';
import { MemberType } from './types/member.js';
import { MemberTypeId } from './types/memberId.js';

import { Context, User, Profile, Member, Post } from './interfaces/index.js';

export const queries = new GraphQLObjectType<unknown, Context>({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id }: User, context) => {
        return await context.loaders.userLoader.load(id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (root, args, context, resolveInfo) => {
        const parsedResolveInfo = parseResolveInfo(resolveInfo);
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfo as ResolveTree,
          new GraphQLList(UserType),
        );

        const isUserSubscribedTo: boolean = 'userSubscribedTo' in fields;
        const isSubscribedToUser: boolean = 'subscribedToUser' in fields;

        const users = await context.prisma.user.findMany({
          include: {
            userSubscribedTo: isUserSubscribedTo,
            subscribedToUser: isSubscribedToUser,
          },
        });

        users.forEach((user) => {
          context.loaders.userLoader.prime(user.id, user);
        });

        return users;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id }: Profile, context) => {
        return await context.prisma.profile.findUnique({
          where: { id },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (root, args, context) => {
        return await context.prisma.profile.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (root, { id }: Member, context) => {
        return await context.prisma.memberType.findUnique({
          where: { id },
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (root, args, context) => {
        return await context.prisma.memberType.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id }: Post, context) => {
        return await context.prisma.post.findUnique({
          where: { id },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root, args, context) => {
        return await context.prisma.post.findMany();
      },
    },
  }),
});
