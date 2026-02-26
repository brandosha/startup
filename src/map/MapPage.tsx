import { useEffect, useMemo, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ThumbsUp, XIcon } from 'lucide-react';

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css';
import './bottom-sheet.css'

import Footer from '../_components/Footer';
import MapView, { Marker } from '../_components/MapView';
import { usePosts } from '../_lib/PostsManager';
import IfAuth from '../_components/IfAuth';
import NewPostForm from '../_components/NewPostForm';
import PostDetails from '../_components/PostDetails';
import PostCard from '../_components/PostCard';
import { getIpLocation, storedMapRegion } from '../_lib/utils';

export default function MapPage() {
  const posts = usePosts();
  const allPosts = posts.getAll();

  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("post");
  const selectedPost = postId ? posts.get(postId) : null;

  const [mapRegion, setMapRegion] = useState(storedMapRegion.get() || {
    center: {
      latitude: 40.2495,
      longitude: -111.648,
    },
    span: {
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
  });

  useEffect(() => {
    getIpLocation().then((loc) => {
      const dist = Math.sqrt(
        Math.pow(loc.latitude - mapRegion.center.latitude, 2) +
        Math.pow(loc.longitude - mapRegion.center.longitude, 2)
      );

      // If the user's location is close to the current map center, don't recenter the map.
      if (dist < 5) return;

      centerMapOnPoint({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }, 2.5);
    })
  }, []);

  const centerMapOnPoint = (coordinate: { latitude: number; longitude: number }, zoom = 0.02) => {
    const region = {
      center: {
        latitude: coordinate.latitude - (zoom * 0.3), // adjust center to account for bottom sheet
        longitude: coordinate.longitude,
      },
      span: {
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      },
    };
    setMapRegion(region);
    storedMapRegion.set(region);
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
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h1>
              Hello, {auth.currentUser()?.username}!
            </h1>

            <button className="btn btn-sm btn-danger" onClick={() => {
              auth.logout();
            }}>
              Log Out
            </button>
          </div>

          <p>Select a post or marker to see details, or tap anywhere on the map to create a new post.</p>
        </div>
      )}
      noAuthContent={(
        <div>
          <p>Select a post or marker to see details. To create a new post you will need to <NavLink to="/login">log in</NavLink>.</p>
        </div>
      )}
    />

    <h2>Nearby Posts</h2>
    {allPosts.map(post => <PostCard key={post.id} post={post} />)}
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
          region={mapRegion}
          markers={markers}
          onPress={mapPressEvent}
          onMarkerPress={mapMarkerPressEvent}
          onRegionChange={storedMapRegion.set}
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
        className="btn btn-secondary p-0 rounded-circle d-flex align-items-center justify-content-center shadow"
        style={{ width: 40, height: 40 }}
        onClick={onClick}
      >
        <XIcon size={24} />
      </button>
    </div>
  );
}
