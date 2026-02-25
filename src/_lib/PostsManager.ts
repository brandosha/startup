import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";

export interface Post {
  id: string;
  title: string;
  content: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
  createdDate: Date;
  expirationDate: Date;
}

const testPosts: Post[] = [
  {
    id: '1',
    title: 'Lost Dog',
    content: 'My dog ran away, last seen near the park.',
    coordinates: {
      latitude: 40.23,
      longitude: -111.65,
    },
    createdDate: new Date(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
  },
  {
    id: '2',
    title: 'Free Food',
    content: 'Free pizza until 7pm',
    coordinates: {
      latitude: 40.26,
      longitude: -111.64,
    },
    createdDate: new Date(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
  }
];

class PostsManager extends StateManager {
  private posts: Post[] = testPosts;

  constructor() {
    super();

    const storedPosts = localStorage.getItem("startup_posts");
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }

  create(post: Omit<Post, "id" | "createdDate" | "expirationDate">) {
    const id = post.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 9);
    const createdDate = new Date();
    const expirationDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24); // 24 hours from creation
    const newPost = { ...post, id, createdDate, expirationDate };
    this.posts.push(newPost);
    this.dispatchChange();

    return newPost;
  }

  get(id: string) {
    return this.posts.find(post => post.id === id);
  }

  getAll() {
    return this.posts;
  }

  dispatchChange(): void {
    super.dispatchChange();
    // localStorage.setItem("startup_posts", JSON.stringify(this.posts));
  }
}

export const posts = new PostsManager();

export function usePosts() {
  const [, setVersion] = useState(0);
  useEffect(() => posts.changeEffect(setVersion), []);
  
  return posts;
}

