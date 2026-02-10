import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container">
        <nav>
          <NavLink to="/">About</NavLink>
          <NavLink to="/map">Map</NavLink>
          <NavLink to="/login">Log in</NavLink>
        </nav>
      </div>
    </header>
  );
}