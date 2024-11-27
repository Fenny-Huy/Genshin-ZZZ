// src/Components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">Home</Link>
      </div>
      <div className="header-right">
        <Link to="/artifactcreate">Create Artifact</Link>
        <Link to="/artifact-list">Artifact List</Link>
      </div>
    </header>
  );
};

export default Header;