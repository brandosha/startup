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
  const [expirationDate, setExpirationDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24)); // default to 24 hours from now

  const expirationOptions = [
    { label: '1 Hour', value: 1000 * 60 * 60 },
    { label: '3 Hours', value: 1000 * 60 * 60 * 3 },
    { label: '6 Hours', value: 1000 * 60 * 60 * 6 },
    { label: '12 Hours', value: 1000 * 60 * 60 * 12 },
    { label: '24 Hours', value: 1000 * 60 * 60 * 24 },
    { label: '3 Days', value: 1000 * 60 * 60 * 24 * 3 },
    { label: '7 Days', value: 1000 * 60 * 60 * 24 * 7 },
  ]

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
              expirationDate,
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
            <label htmlFor="expiration" className="form-label">Expiration Time</label>
            <input
              type="datetime-local"
              id="expiration"
              name="expiration"
              className="form-control"
              value={expirationDate.toISOString().slice(0, 16)}
              onChange={(e) => setExpirationDate(new Date(e.target.value))}
            />

            <div className="mt-2 mb-4 d-flex flex-wrap gap-1">
              {expirationOptions.map(option => (
                <button
                  type="button"
                  className="btn btn-outline-dark small"
                  onClick={() => setExpirationDate(new Date(Date.now() + option.value))}
              >
                {option.label}
              </button>
              ))}
            </div>

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