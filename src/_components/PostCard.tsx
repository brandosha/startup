import { Post } from "../_lib/PostsManager";
import { useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import UsernameBadge from "./UsernameBadge";

export default function PostCard({ post }: { post: Post}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const postUrl = `/map?post=${post.id}`;

  return (
    <a href={postUrl} className="link-underline-opacity-0 link-body-emphasis" onClick={(e) => {
      e.preventDefault();
      
      console.log(location);
      if (location.pathname === '/map') {
        setSearchParams({ post: post.id });
      } else {
        navigate(postUrl);
      }
    }}>
      <div className="nearby-post">
        <UsernameBadge username={post.username} date={post.createdDate} />
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
    </a>
  );
};