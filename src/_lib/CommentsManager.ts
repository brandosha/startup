import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";
import { auth } from "./AuthManager";


interface Comment {
  postId: string;
  username: string;
  content: string;
  createdDate: Date;
}

class CommentsManager extends StateManager {

  private comments: { [postId: string]: Comment[] } = {};

  async create(comment: Omit<Comment, "username" | "createdDate">) {
    const res = await auth.doFetch("/api/comments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (!res.ok) {
      throw new Error("Failed to create comment");
    }

    const json = await res.json();
    const newComment = this.commentFromJson(json);
    this.insertComment(newComment);
    this.dispatchChange();
  }

  get(postId: string) {
    if (this.comments[postId] == undefined) {
      this.fetchComments(postId);
    }

    return this.comments[postId]?.toReversed() || [];
  }

  async fetchComments(postId: string) {
    const res = await auth.doFetch("/api/comments/get?postId=" + postId);
    const json = await res.json();
    const comments = json.map((c: any) => this.commentFromJson(c));
    this.comments[postId] = comments;
    this.dispatchChange();
  }

  private commentFromJson(json: any): Comment {
    return {
      postId: json.postId,
      username: json.username,
      content: json.content,
      createdDate: new Date(json.createdDate)
    };
  }

  private insertComment(comment: Comment) {
    if (!this.comments[comment.postId]) {
      this.comments[comment.postId] = [];
    }

    this.comments[comment.postId].push(comment);
  }
}

export const comments = new CommentsManager();

export function useComments() {
  const [, setVersion] = useState(0);
  useEffect(() => comments.changeEffect(setVersion), []);
  
  return comments;
}