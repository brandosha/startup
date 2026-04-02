import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";

import { serverEvents } from "./ServerEvents";
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

class PostsManager extends StateManager {
  private posts: { [id: string]: Post | null } = {};

  constructor() {
    super();

    serverEvents.subscribeNewPosts();
  }

  async create(post: Omit<Post, "id" | "createdDate" | "username">) {
    const res = await auth.doFetch("/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create post");
    }

    const json = await res.json();
    const newPost = this.postFromJson(json);
    this.posts[newPost.id] = newPost;
    this.dispatchChange();

    return newPost;
  }

  get(id: string) {
    if (!this.posts.hasOwnProperty(id)) {
      this.fetchPost(id);
    }

    return this.posts[id]
  }

  async fetchPost(id: string) {
    const res = await fetch(`/api/posts/get?id=${id}`);
    if (res.status === 404) {
      this.posts[id] = null;
      this.dispatchChange();
      return null;
    } else if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch post");
    }

    const json = await res.json();
    const post = this.postFromJson(json);
    this.posts[post.id] = post;
    this.dispatchChange();

    return post;
  }

  getAll() {
    return Object.values(this.posts).filter(post => post != null);
  }

  async fetchAll() {
    const res = await fetch("/api/posts/all");
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch posts");
    }

    const json = await res.json();
    json.forEach((p: any) => {
      this.posts[p.id] = this.postFromJson(p);
    });
    this.dispatchChange();

    return this.getAll();
  }

  private postFromJson(json: any): Post {
    return {
      id: json.id,
      username: json.username,
      title: json.title,
      content: json.content,
      coordinates: {
        latitude: json.coordinates.latitude,
        longitude: json.coordinates.longitude,
      },
      createdDate: new Date(json.createdDate),
      expirationDate: new Date(json.expirationDate),
    };
  }
}

export const posts = new PostsManager();

export function usePosts() {
  const [, setVersion] = useState(0);
  useEffect(() => posts.changeEffect(setVersion), []);
  
  return posts;
}

