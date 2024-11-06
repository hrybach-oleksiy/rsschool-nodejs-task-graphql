import { GraphQLObjectType, GraphQLInt, GraphQLFloat } from 'graphql';

import { MemberTypeId } from './memberId.js';

const fieldsConfig = {
  id: { type: MemberTypeId },
  discount: { type: GraphQLFloat },
  postsLimitPerMonth: { type: GraphQLInt },
};

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => fieldsConfig,
});
