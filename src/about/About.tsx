import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../_components/Header';
import Footer from '../_components/Footer';

export default function About() {
  return (
    <>
      <Header />

      <main className="container py-4">
        <h1>Neighborhood</h1>

        <p>
          See what’s happening around you. View posts from your neighborhood, share updates, and connect with those nearby.
        </p>
        <p>
          <NavLink to="/login">Log in</NavLink> to get started!
        </p>
      </main>

      <Footer />
    </>
  )
}