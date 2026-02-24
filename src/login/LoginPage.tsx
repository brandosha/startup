import React from 'react';
import Header from '../_components/Header';
import Footer from '../_components/Footer';

export default function LoginPage() {
  return (
    <>
      <Header />

      <main className="d-flex flex-column align-items-center justify-content-center gap-3">
        <h1>Log in</h1>

        <form action="/map.html" method="get" className="center-vertical">
          <div>
            <label htmlFor="new-username" className="form-label">Username</label>
            <input type="text" id="new-username" name="new-username" className="form-control" />
          </div>
          
          <div>
            <label htmlFor="new-password" className="form-label">Password</label>
            <input type="password" id="new-password" name="new-password" className="form-control" />
          </div>
          
          <button type="submit" className="btn btn-primary mt-3 w-100">Log In</button>
        </form>

        <h2 className="mt-4">or Create an Account</h2>

        <form action="/map.html" method="get" className="center-vertical">
          <div>
            <label htmlFor="new-username" className="form-label">Username</label>
            <input type="text" id="new-username" name="new-username" className="form-control" />
          </div>
          
          <div>
            <label htmlFor="new-password" className="form-label">Password</label>
            <input type="password" id="new-password" name="new-password" className="form-control" />
          </div>
          
          <button type="submit" className="btn btn-primary mt-3 w-100">Register</button>
        </form>
      </main>

      <Footer />
    </>
  )
}