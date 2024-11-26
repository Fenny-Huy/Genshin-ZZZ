// src/Pages/ArtifactList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArtifactListingForm from '../Components/ArtifactListingForm';

const ArtifactListing = () => {
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/genshinartifacts/'); // Adjust the URL as needed
        setArtifacts(response.data);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
      }
    };

    fetchArtifacts();
  }, []);

  return (
    <div>
      <h1>Artifact List</h1>
      {artifacts.map((artifact, index) => (
        <ArtifactListingForm key={index} artifact={artifact} />
      ))}
    </div>
  );
};

export default ArtifactListing;