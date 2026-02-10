import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './_components/Header';
import './app.css';
import { Footer } from './_components/Footer';
import About from './about/About';
import Login from './login/Login';
import Map from './map/map';

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container text-center">
    <div className="mt-4">404: Return to sender. Address unknown.</div>
  </main>;
}