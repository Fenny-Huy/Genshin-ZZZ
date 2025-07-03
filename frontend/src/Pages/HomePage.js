// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Pages/HomePage.module.css';

const HomePage = () => {
  const features = [
    {
      icon: '⚔️',
      title: 'Create Artifact',
      description: 'Add new artifacts to your collection with detailed stats and substats',
      link: '/artifactcreate'
    },
    {
      icon: '📋',
      title: 'Artifact List',
      description: 'View and manage all your artifacts in an organized table',
      link: '/artifact-list'
    },
    {
      icon: '🔍',
      title: 'Search Artifacts',
      description: 'Find specific artifacts using advanced filtering options',
      link: '/search-artifacts'
    },
    {
      icon: '📈',
      title: 'Leveling Progress',
      description: 'Track and manage your artifact enhancement progress',
      link: '/leveling-list'
    },
    {
      icon: '📊',
      title: 'Statistics',
      description: 'Analyze your artifact collection with detailed statistics',
      link: '/statistics'
    },
    {
      icon: '📉',
      title: 'Advanced Analytics',
      description: 'Deep dive into substat distributions and investment analysis',
      link: '/substatistics'
    }
  ];

  return (
    <div className={styles.homepage_container}>
      <div className={styles.hero_section}>
        <h1 className={styles.main_title}>Genshin Artifacts</h1>
        <p className={styles.subtitle}>
          Your comprehensive artifact management system for Genshin Impact. 
          Track, analyze, and optimize your artifact collection with powerful tools and insights.
        </p>
      </div>

      <div className={styles.features_grid}>
        {features.map((feature, index) => (
          <Link 
            key={index}
            to={feature.link} 
            className={styles.feature_card}
          >
            <span className={styles.feature_icon}>{feature.icon}</span>
            <h3 className={styles.feature_title}>{feature.title}</h3>
            <p className={styles.feature_description}>{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className={styles.cta_section}>
        <Link to="/artifactcreate" className={styles.primary_button}>
          ✨ Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;