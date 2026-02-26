import { useState } from "react";
import { Post, usePosts } from "../_lib/PostsManager";
import IfAuth from "./IfAuth";
import { NavLink } from "react-router-dom";

interface NewPostFormProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  onPost: (post: Post) => void;
}

export default function NewPostForm({ coordinates, onPost }: NewPostFormProps) {
  const posts = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <IfAuth
      content={(auth) => (
        <div id="new-post">
          <form onSubmit={(e) => {
            e.preventDefault();

            const newPost = posts.create({
              title,
              content,
              coordinates,
              expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
            });
            onPost(newPost);
          }}>
            <h1>New Post</h1>
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
            />
            <br />
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br />
            <button type="submit" className="btn btn-primary w-100">
              Post
            </button>
          </form>
        </div>
      )}
      noAuthContent={(
        <div>
          <h1>New Post</h1>
          <p>You must be logged in to create a post.</p>
          <div className="d-flex justify-content-center p-2">
            <NavLink to="/login" className="btn btn-primary">
              Log In
            </NavLink>
          </div>
        </div>
      )}
    />
  )
}