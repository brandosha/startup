import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css';
import './bottom-sheet.css'

import Footer from '../_components/Footer';
import MapView, { Marker } from '../_components/MapView';

export default function MapPage() {

  const [newPostMarker, setNewPostMarker] = useState<Marker | null>(null);

  const mapPressEvent = (coordinate: { latitude: number; longitude: number }) => {
    console.log("Map pressed at coordinate:", coordinate);
    setNewPostMarker({
      id: 'NEW_POST',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: 'New Post',
      color: '#008743',
    });
  };

  const markers = useMemo(() => {
    let markers = [];
    if (newPostMarker) {
      markers.push(newPostMarker);
    }

    markers = markers.concat([
      {
        id: '1',
        latitude: 40.248793100556114,
        longitude: -111.64922954905643,
        title: 'BYU',
        color: '#247cff'
      }
    ]);

    return markers;
  }, [newPostMarker]);

  return (
    <>
      <main>
        <MapView
          className='map'
          markers={markers}
          onPress={mapPressEvent}
        />

        <BottomSheet 
          open 
          blocking={false} 
          snapPoints={(p) => [p.headerHeight + 100, p.maxHeight * 0.5, p.maxHeight * 0.95]}
          defaultSnap={(p) => p.maxHeight * 0.5}
          expandOnContentDrag={true}
        >
          <div className='map-sheet'>
            <div>
              <h1>
                Hello, [Username]!
              </h1>
              <NavLink to="/">Log Out</NavLink>
            </div>

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

            <div>
              <h1>Nearby Posts</h1>
              <div className="nearby-post">
                <h2>Sample Post Title</h2>
                <p>Here is something that's relevant to a nearby location.</p>
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
            </div>
          </div>
        </BottomSheet>
      </main>

      <Footer />
    </>
  )
}