import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from './memberId.js';
import { MemberType } from './member.js';
import { Context, Profile } from '../interfaces/interfaces.js';

const profileFields = {
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MemberTypeId },
};

const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    ...profileFields,
    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId }, args, { loaders }) => {
        return loaders.memberLoader.load(memberTypeId);
      },
    },
  }),
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => profileFields,
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: profileFields.isMale,
    yearOfBirth: profileFields.yearOfBirth,
    memberTypeId: profileFields.memberTypeId,
  }),
});

export { ProfileType, CreateProfileInput, ChangeProfileInput };
