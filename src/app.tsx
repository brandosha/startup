import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.css';
import About from './about/About';
import Login from './login/Login';
import Map from './map/map';
import Header from './_components/Header';
import Footer from './_components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <>
      <Header />

      <main className="container d-flex flex-column align-items-center">
        <div className='mt-4 p-2' style={{ maxWidth: '250px' }}>
          <h1>404</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
        
      </main>

      <Footer />
    </>
  );
}