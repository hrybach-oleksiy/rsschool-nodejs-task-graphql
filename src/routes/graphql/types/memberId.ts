import { GraphQLEnumType } from 'graphql';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'BASIC',
    },
    business: {
      value: 'BUSINESS',
    },
  },
});
