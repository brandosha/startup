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

  constructor() {
    super();

    const storedComments = localStorage.getItem("startup_comments");
    if (storedComments) {
      this.comments = JSON.parse(storedComments);
      Object.values(this.comments).forEach(comments => {
        comments.forEach(comment => {
          comment.createdDate = new Date(comment.createdDate);
        });
      });
    }
  }

  create(comment: Omit<Comment, "username" | "createdDate">) {
    const user = auth.currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const newComment = {
      ...comment,
      username: user.username,
      createdDate: new Date()
    };

    const { postId } = comment;
    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }
    this.comments[postId].push(newComment);
    this.dispatchChange();

    setTimeout(() => {
      const responseComment = {
        postId: newComment.postId,
        username: "Responder",
        content: `${newComment.username}, you said: "${newComment.content}"`,
        createdDate: new Date()
      };
      this.comments[postId].push(responseComment);
      this.dispatchChange();
    }, 1500);
  }

  get(postId: string) {
    return this.comments[postId]?.toReversed() || [];
  }

  dispatchChange(): void {
    super.dispatchChange();
    localStorage.setItem("startup_comments", JSON.stringify(this.comments));
  }
}

export const comments = new CommentsManager();

export function useComments() {
  const [, setVersion] = useState(0);
  useEffect(() => comments.changeEffect(setVersion), []);
  
  return comments;
}