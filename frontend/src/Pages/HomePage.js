// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Pages/HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homepage_container}>
      <h1>Welcome to Genshin Artifacts</h1>
      <p>This application allows you to create and list artifacts for Genshin Impact.</p>
      <div>
        <Link to="/artifactcreate" className={styles.button}>Create Artifact</Link>
        <Link to="/artifact-list" className={styles.button}>Artifact List</Link>
        <Link to="/search-artifacts" className={styles.button}>Search Artifacts</Link>
        <Link to="/leveling-list" className={styles.button}>Artifact Leveling List</Link>
        <Link to="/statistics" className={styles.button}>Statistics</Link>
        <Link to="/substatistics" className={styles.button}>Substatistics</Link>
      </div>
    </div>
  );
};

export default HomePage;