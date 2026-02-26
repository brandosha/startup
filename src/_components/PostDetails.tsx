import { ThumbsUp } from "lucide-react";
import { Post } from "../_lib/PostsManager";

export default function PostDetails({ post }: { post: Post}) {
  return (
    <div className="nearby-post">
      <h5>
        <span className='badge text-bg-secondary'>
          {post.username}
        </span>
      </h5>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button className="btn btn-primary">
        <ThumbsUp size={20} />
        <span className='ms-2'>
          Like
        </span>
      </button>
      <form className="mt-3">
        <div className="row g-3">
          <div className="col">
            <input type="text" className="form-control" placeholder="Add a comment" required />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </div>
      </form>
    </div>
  );
};