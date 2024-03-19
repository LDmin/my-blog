import { createYoga } from "graphql-yoga";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";

import type PrismaTypes from "@pothos/plugin-prisma/generated";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({});

builder.mutationType({});

builder.prismaObject("Article", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
  }),
});

builder.queryField("article", (t) =>
  t.prismaField({
    type: "Article",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args) =>
      prisma.article.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
);

builder.queryField("articles", (t) =>
  t.prismaField({
    type: ["Article"],
    args: {
      take: t.arg.int({ required: true }),
      skip: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args) =>
      prisma.article.findMany({
        ...query,
        take: args.take,
        skip: args.skip,
        orderBy: {
          createdAt: "desc",
        },
      }),
  })
);

builder.queryField("count", (t) =>
  t.int({ resolve: async (query) => prisma.article.count() })
);

builder.mutationField("createArticle", (t) =>
  t.prismaField({
    type: "Article",
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: true }),
      createdAt: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.article.create({
        ...query,
        data: {
          title: args.title,
          content: args.content,
          createdAt: args.createdAt,
        },
      }),
  })
);

const schema = builder.toSchema();

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
