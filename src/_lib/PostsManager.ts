import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";

import { auth } from "./AuthManager";

export interface Post {
  id: string;
  username: string;
  title: string;
  content: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
  createdDate: Date;
  expirationDate: Date;
}

const testPosts: { [id: string]: Post } = {
  '1': {
    id: '1',
    username: 'alice',
    title: 'Lost Dog',
    content: 'My dog ran away, last seen near the park.',
    coordinates: {
      latitude: 40.23,
      longitude: -111.65,
    },
    createdDate: new Date(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
  },
  '2': {
    id: '2',
    username: 'bob',
    title: 'Free Food',
    content: 'Free pizza until 7pm',
    coordinates: {
      latitude: 40.26,
      longitude: -111.64,
    },
    createdDate: new Date(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
  }
};

class PostsManager extends StateManager {
  private posts: { [id: string]: Post } = testPosts;

  constructor() {
    super();

    const storedPosts = localStorage.getItem("startup_posts");
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
      Object.values(this.posts).forEach(post => {
        post.createdDate = new Date(post.createdDate);
        post.expirationDate = new Date(post.expirationDate);
      });
    }
  }

  create(post: Omit<Post, "id" | "createdDate" | "username">) {
    const user = auth.currentUser();
    if (!user) {
      throw new Error("User must be logged in to create a post");
    }

    const id = post.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 9);
    const createdDate = new Date();
    const newPost = {
      ...post,
      id,
      username: user.username,
      createdDate,
    };

    this.posts[id] = newPost;
    this.dispatchChange();

    return newPost;
  }

  get(id: string) {
    return this.posts[id];
  }

  getAll() {
    return Object.values(this.posts);
  }

  dispatchChange(): void {
    super.dispatchChange();
    localStorage.setItem("startup_posts", JSON.stringify(this.posts));
  }
}

export const posts = new PostsManager();

export function usePosts() {
  const [, setVersion] = useState(0);
  useEffect(() => posts.changeEffect(setVersion), []);
  
  return posts;
}

