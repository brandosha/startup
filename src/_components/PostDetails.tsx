import { Post } from "../_lib/PostsManager";
import { useComments } from "../_lib/CommentsManager";
import { useState } from "react";
import IfAuth from "./IfAuth";
import UsernameBadge from "./UsernameBadge";

export default function PostDetails({ post }: { post: Post}) {
  const comments = useComments();
  const postComments = comments.get(post.id);

  const [newComment, setNewComment] = useState("");

  return (
    <div className="nearby-post">
      <div className="mb-4">
        <UsernameBadge username={post.username} date={post.createdDate} />
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>

      <h4>Comments ({postComments.length})</h4>

      <IfAuth
        content={(auth) => (
          <form
            className="mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              comments.create({
                postId: post.id,
                content: newComment,
              });
              setNewComment("");
            }}
          >
            <div className="row g-3">
              <div className="col">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Add a comment" 
                  required 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </div>
          </form>
        )}
      />
      
      <div className="mt-2">
        {postComments.map((comment, i) => (
          <div key={comment.createdDate.getTime()} className={"p-3 " + (i !== 0 ? "border-top" : "")}>
            <UsernameBadge username={comment.username} date={comment.createdDate} />
            <p className="m-0 px-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};