import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import depthLimit from 'graphql-depth-limit';
import { graphql, validate, parse } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

import { initDataLoaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const loaders = initDataLoaders(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validationResult = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationResult?.length > 0) {
        return { data: null, errors: validationResult };
      }

      try {
        const response = await graphql({
          schema,
          source: req.body.query,
          contextValue: { prisma, loaders },
          variableValues: req.body.variables,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Internal server error';
        return {
          data: null,
          errors: [{ message: errorMessage }],
        };
      }
    },
  });
};

export default plugin;
