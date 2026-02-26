import React, { use, useEffect, useMemo, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ThumbsUp, XIcon } from 'lucide-react';

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css';
import './bottom-sheet.css'

import Footer from '../_components/Footer';
import MapView, { Marker } from '../_components/MapView';
import { Post, usePosts } from '../_lib/PostsManager';
import IfAuth from '../_components/IfAuth';

export default function MapPage() {
  const posts = usePosts();
  const allPosts = posts.getAll();

  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("post");
  const selectedPost = postId ? posts.get(postId) : null;

  const [mapRegion, setMapRegion] = useState({
    center: {
      latitude: 40.2495,
      longitude: -111.648,
    },
    span: {
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  });

  const centerMapOnPoint = (coordinate: { latitude: number; longitude: number }, zoom = 0.02) => {
    setMapRegion(prev => ({
      center: {
        latitude: coordinate.latitude - (zoom * 0.3), // adjust center to account for bottom sheet
        longitude: coordinate.longitude,
      },
      span: {
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
    }));
  }

  useEffect(() => {
    if (selectedPost) {
      centerMapOnPoint(selectedPost.coordinates);
    }
  }, [selectedPost])

  const [newPostMarker, setNewPostMarker] = useState<Marker | null>(null);

  const mapMarkerPressEvent = (marker: Marker) => {
    console.log("Marker pressed:", marker);
    setNewPostMarker(null);
    setSearchParams({ post: marker.id });
  }

  const mapPressEvent = (coordinate: { latitude: number; longitude: number }) => {
    console.log("Map pressed at coordinate:", coordinate);
    const newMarker = {
      id: '',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: 'New Post',
      color: '#008743',
    }
    setNewPostMarker(newMarker);
    setSearchParams({});
  };

  const markers = useMemo(() => {
    let markers = allPosts.map(post => ({
      id: post.id,
      latitude: post.coordinates.latitude,
      longitude: post.coordinates.longitude,
      title: post.title,
    }));

    if (newPostMarker) {
      markers.push(newPostMarker);
    }

    return markers;
  }, [newPostMarker]);

  let sheetContent = <div>
    <IfAuth
      content={(auth) => (
        <div>
          <h1>
            Hello, {auth.currentUser()?.username}!
          </h1>
          
          <button className="btn btn-link" onClick={() => {
            auth.logout();
          }}>
            Log Out
          </button>

          <p>Tap on a marker to see details, or tap on the map to create a new post.</p>
        </div>
      )}
      noAuthContent={(
        <div>
          <p>Tap on a marker to see details, or <NavLink to="/login">log in</NavLink> to create a new post.</p>
        </div>
      )}
    />

    <h2>Nearby Posts</h2>
    {allPosts.map(post => <PostDetails key={post.id} post={post} />)}
  </div>;

  if (newPostMarker) {
    sheetContent = (
      <div>
        <TopCloseButton onClick={() => setNewPostMarker(null)} />
        <NewPostForm
          coordinates={newPostMarker}
          onPost={(post) => {
            setNewPostMarker(null);
            setSearchParams({ post: post.id });
          }}
        />
      </div>
    );
  } else if (selectedPost) {
    sheetContent = (
      <div>
        <TopCloseButton onClick={() => setSearchParams({})} />
        <PostDetails post={selectedPost} />
      </div>
    );
  }

  return (
    <>
      <main>
        <MapView
          className='map'
          markers={markers}
          onPress={mapPressEvent}
          onMarkerPress={mapMarkerPressEvent}
          region={mapRegion}
        />

        <BottomSheet 
          open 
          blocking={false} 
          snapPoints={(p) => [p.headerHeight + 100, p.maxHeight * 0.5, p.maxHeight * 0.95]}
          defaultSnap={(p) => p.maxHeight * 0.5}
          expandOnContentDrag={true}
        >
          <div className='map-sheet'>
            {sheetContent}
          </div>
        </BottomSheet>
      </main>

      <Footer />
    </>
  )
}

function TopCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className='fixed-top p-3 d-flex justify-content-end w-100'>
      <button
        className="btn btn-secondary p-0 rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: 40, height: 40 }}
        onClick={onClick}
      >
        <XIcon size={24} />
      </button>
    </div>
  );
}

interface NewPostFormProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  onPost: (post: Post) => void;
}

function NewPostForm({ coordinates, onPost }: NewPostFormProps) {
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

function PostDetails({ post }: { post: Post}) {
  return (
    <div className="nearby-post">
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