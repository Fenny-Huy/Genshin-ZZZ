import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Components/Header.module.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_left}>
        <Link to="/">Home</Link>
      </div>
      <div className={styles.header_right}>
        <Link to="/artifactcreate">Create Artifact</Link>
        <Link to="/artifact-list">Artifact List</Link>
        <Link to="/search-artifacts">Search Artifacts</Link>
        <Link to="/leveling-list">Artifact Leveling List</Link>
        <Link to="/statistics">Statistics</Link>
        <Link to="/substatistics">Substatistics</Link>
      </div>
    </header>
  );
};

export default Header;
