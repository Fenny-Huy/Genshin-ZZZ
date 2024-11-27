// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to Genshin Artifacts</h1>
      <p>This application allows you to create and list artifacts for Genshin Impact.</p>
      <div>
        <Link to="/artifactcreate" className="button">Create Artifact</Link>
        <Link to="/artifact-list" className="button">Artifact List</Link>
      </div>
    </div>
  );
};

export default HomePage;