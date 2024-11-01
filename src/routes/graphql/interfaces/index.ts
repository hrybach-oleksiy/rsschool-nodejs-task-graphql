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
