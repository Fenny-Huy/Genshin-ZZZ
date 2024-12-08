// src/Components/ArtifactListingForm.js
import React, { useState } from 'react';
import EditArtifactModal from './EditArtifactModal';
import AddArtifactLevelingModal from './AddArtifactLevelingModal';
import axios from 'axios';

const ArtifactListingForm = ({ artifact }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLevelingModalOpen, setIsLevelingModalOpen] = useState(false);
  const [artifactData, setArtifactData] = useState(null);
  const [artifactLevelingData, setArtifactLevelingData] = useState(null);
  const [notification, setNotification] = useState(false);

  const renderCheckbox = (value) => (
    <input type="checkbox" checked={value === 1} readOnly />
  );

  const handleUpdateSuccess = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 3000); // Hide notification after 3 seconds
  };

  const openLevelingModal = async () => {
    try {
      const artifactResponse = await axios.get(`http://localhost:8000/artifact/${artifact.id}`);
      setArtifactData(artifactResponse.data);
      const levelingResponse = await axios.get(`http://localhost:8000/artifactleveling/${artifact.id}`);
      setArtifactLevelingData(levelingResponse.data);
      setIsLevelingModalOpen(true);
    } catch (error) {
      console.error('Error fetching artifact data:', error);
    }
  };

  return (
    <>
      <tr className="artifact-row">
        <td>{artifact.id}</td>
        <td>{artifact.set}</td>
        <td>{artifact.type}</td>
        <td>{artifact.main_stat}</td>
        <td>{artifact.number_of_substats}</td>
        <td>{renderCheckbox(artifact.atk_percent)}</td>
        <td>{renderCheckbox(artifact.hp_percent)}</td>
        <td>{renderCheckbox(artifact.def_percent)}</td>
        <td>{renderCheckbox(artifact.atk)}</td>
        <td>{renderCheckbox(artifact.hp)}</td>
        <td>{renderCheckbox(artifact.defense)}</td>
        <td>{renderCheckbox(artifact.er)}</td>
        <td>{renderCheckbox(artifact.em)}</td>
        <td>{renderCheckbox(artifact.crit_rate)}</td>
        <td>{renderCheckbox(artifact.crit_dmg)}</td>
        <td>{artifact.where_got_it}</td>
        <td>{artifact.score}</td>
        <td>
          <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
          <button onClick={openLevelingModal}>Add Leveling</button>
        </td>
      </tr>
      {isEditModalOpen && (
        <EditArtifactModal
          artifact={artifact}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      {isLevelingModalOpen && artifactData && (
        <AddArtifactLevelingModal
          artifact={artifactData}
          artifactLeveling={artifactLevelingData}
          onClose={() => setIsLevelingModalOpen(false)}
        />
      )}
      {notification && <div className="notification">Artifact updated successfully!</div>}
    </>
  );
};

export default ArtifactListingForm;