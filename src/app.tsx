import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.css';
import AboutPage from './about/AboutPage';
import LoginPage from './login/LoginPage';
import MapPage from './map/MapPage';
import Header from './_components/Header';
import Footer from './_components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />
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