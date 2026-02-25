import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css';
import './bottom-sheet.css'

import Footer from '../_components/Footer';
import MapView, { Marker } from '../_components/MapView';
import { Post, usePosts } from '../_lib/PostsManager';

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
        latitude: coordinate.latitude - (zoom * 0.2), // adjust center to account for bottom sheet
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
    <div>
      <h1>
        Hello, [Username]!
      </h1>
      <NavLink to="/">Log Out</NavLink>
    </div>

    <h1>Nearby Posts</h1>
    <p>Tap on a marker to see details, or tap on the map to create a new post.</p>
    {allPosts.map(post => <PostDetails key={post.id} post={post} />)}
  </div>;
  if (newPostMarker) {
    sheetContent = <NewPost />;
  } else if (postId) {
    sheetContent = <PostDetails post={posts.get(postId)!} />;
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

function NewPost() {
  return (
    <div id="new-post">
      <form>
        <h1>New Post</h1>
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" id="title" name="title" className="form-control" required />
        <br />
        <label htmlFor="content" className="form-label">Content</label>
        <textarea id="content" name="content" className="form-control" required></textarea>
        <br />
        <button type="submit" className="btn btn-primary w-100">Post</button>
      </form>
    </div>
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