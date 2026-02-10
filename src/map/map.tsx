import React from 'react';
import { NavLink } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import Footer from '../_components/Footer';

export default function Map() {
  return (
    <>
      <main>
        <img src="/map-placeholder.png" alt="Map Placeholder" className="map" />

        <div className="map-sheet-container">
          <div className="map-sheet-spacer"></div>
          <div className="map-sheet">
            <div>
              <h1>
                Hello, [Username]!
              </h1>
              <NavLink to="/index.html">Log Out</NavLink>
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
        </div>
      </main>

      <Footer />
    </>
  )
}