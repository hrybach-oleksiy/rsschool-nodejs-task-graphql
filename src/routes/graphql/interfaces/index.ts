import { PrismaClient } from '@prisma/client';
import { initDataLoaders } from '../loaders.js';

interface Subscription {
  subscriberId: string;
  authorId: string;
}

export interface User {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo: Subscription[];
  subscribedToUser: Subscription[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface Member {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

type Loaders = ReturnType<typeof initDataLoaders>;

export interface Context {
  prisma: PrismaClient;
  loaders: Loaders;
}
