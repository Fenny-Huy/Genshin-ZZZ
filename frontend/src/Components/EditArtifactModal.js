// src/Components/EditArtifactModal.js
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './EditArtifactModal.css'; // Import the CSS file

const EditArtifactModal = ({ artifact, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    artifactSet: { value: artifact.set, label: artifact.set },
    type: { value: artifact.type, label: artifact.type },
    mainStat: { value: artifact.main_stat, label: artifact.main_stat },
    numberOfSubstats: artifact.number_of_substats,
    substats: [
      artifact.atk_percent ? '%ATK' : null,
      artifact.hp_percent ? '%HP' : null,
      artifact.def_percent ? '%DEF' : null,
      artifact.atk ? 'ATK' : null,
      artifact.hp ? 'HP' : null,
      artifact.defense ? 'DEF' : null,
      artifact.er ? 'ER' : null,
      artifact.em ? 'EM' : null,
      artifact.crit_rate ? 'Crit Rate' : null,
      artifact.crit_dmg ? 'Crit DMG' : null,
    ].filter(Boolean),
    score: artifact.score,
    source: artifact.where_got_it,
  });




  const artifactTypes = [
    { value: 'Flower', label: 'Flower' },
    { value: 'Plume', label: 'Plume' },
    { value: 'Sand', label: 'Sand' },
    { value: 'Goblet', label: 'Goblet' },
    { value: 'Circlet', label: 'Circlet' },
  ];

  const mainStatsOptions = {
    Flower: [{ value: 'HP', label: 'HP' }],
    Plume: [{ value: 'ATK', label: 'ATK' }],
    Sand: [
      { value: '%HP', label: '%HP' },
      { value: '%ATK', label: '%ATK' },
      { value: '%DEF', label: '%DEF' },
      { value: 'ER', label: 'ER' },
      { value: 'EM', label: 'EM' },
    ],
    Goblet: [
      { value: '%HP', label: '%HP' },
      { value: '%ATK', label: '%ATK' },
      { value: '%DEF', label: '%DEF' },
      { value: 'EM', label: 'EM' },
      { value: 'Physical', label: 'Physical' },
      { value: 'Anemo', label: 'Anemo' },
      { value: 'Geo', label: 'Geo' },
      { value: 'Electro', label: 'Electro' },
      { value: 'Dendro', label: 'Dendro' },
      { value: 'Hydro', label: 'Hydro' },
      { value: 'Pyro', label: 'Pyro' },
      { value: 'Cryo', label: 'Cryo' },
    ],
    Circlet: [
      { value: '%HP', label: '%HP' },
      { value: '%ATK', label: '%ATK' },
      { value: '%DEF', label: '%DEF' },
      { value: 'EM', label: 'EM' },
      { value: 'Crit Rate', label: 'Crit Rate' },
      { value: 'Crit DMG', label: 'Crit DMG' },
      { value: 'Healing', label: 'Healing' },
    ],
  };

  const allSubstats = ['HP', '%HP', 'ATK', '%ATK', 'DEF', '%DEF', 'ER', 'EM', 'Crit Rate', 'Crit DMG'];
  const scores = ['Complete trash', 'Trash', 'Usable', 'Good', 'Excellent', 'Marvelous', 'Unknown'];
  const sources = ['Domain farming', 'Bosses', 'Strongbox', 'Spiral Abyss'];
  const artifactSets = [
    "Archaic Petra",
    "Blizzard Strayer",
    "Bloodstained Chivalry",
    "Crimson Witch of Flames",
    "Deepwood Memories",
    "Desert Pavilion Chronicle",
    "Echoes of an Offering",
    "Emblem of Severed Fate",
    "Flower of Paradise Lost",
    "Fragment of Harmonic Whimsy",
    "Gilded Dreams",
    "Gladiator's Finale",
    "Golden Troupe",
    "Heart of Depth",
    "Husk of Opulent Dreams",
    "Lavawalker",
    "Maiden Beloved",
    "Marechaussee Hunter",
    "Nighttime of Whispers in the Echoing Woods",
    "Noblesse Oblige",
    "Nymph's Dream",
    "Obsidian Codex",
    "Ocean-Hued Clam",
    "Pale Flame",
    "Retracing Bolide",
    "Scroll of the Hero of Cinder City",
    "Shimenawa's Reminiscence",
    "Song of Days Past",
    "Tenacity of the Millelith",
    "Thundering Fury",
    "Thundersoother",
    "Unfinished Reverie",
    "Vermillion Hereafter",
    "Viridescent Venerer",
    "Vourukasha's Glow",
    "Wanderer's Troupe"
  ];

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [field]: selectedOption,
      };

      if (field === 'type') {
        updatedFormData.mainStat = null;
        updatedFormData.substats = [];
        updatedFormData.numberOfSubstats = '';
      }

      if (field === 'mainStat') {
        updatedFormData.substats = prev.substats.filter((substat) => substat !== selectedOption.value);
      }

      return updatedFormData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        substats: checked
          ? [...prev.substats, value]
          : prev.substats.filter((substat) => substat !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    const payload = {
      id: artifact.id,
      set: formData.artifactSet.value,
      type: formData.type.value,
      main_stat: formData.mainStat.value,
      number_of_substats: formData.numberOfSubstats,
      atk_percent: formData.substats.includes('%ATK') ? 1 : 0,
      hp_percent: formData.substats.includes('%HP') ? 1 : 0,
      def_percent: formData.substats.includes('%DEF') ? 1 : 0,
      atk: formData.substats.includes('ATK') ? 1 : 0,
      hp: formData.substats.includes('HP') ? 1 : 0,
      defense: formData.substats.includes('DEF') ? 1 : 0,
      er: formData.substats.includes('ER') ? 1 : 0,
      em: formData.substats.includes('EM') ? 1 : 0,
      crit_rate: formData.substats.includes('Crit Rate') ? 1 : 0,
      crit_dmg: formData.substats.includes('Crit DMG') ? 1 : 0,
      where_got_it: formData.source,
      score: formData.score,
    };

    try {
      await axios.put(`http://localhost:8000/genshinartifacts/${artifact.id}/`, payload);
      onUpdateSuccess(); // Call the callback function
      onClose();
    } catch (error) {
      console.error('Error updating artifact:', error);
    }
  };

  // Check if the save button should be disabled
  const isSaveDisabled = !(
    formData.artifactSet &&
    formData.type &&
    formData.mainStat &&
    formData.numberOfSubstats &&
    formData.substats.length === parseInt(formData.numberOfSubstats, 10) &&
    formData.score &&
    formData.source
  );


  // Filter substats based on the selected main stat
  const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat?.value);

  return (
    
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Artifact</h2>
        <form className="form">
          <div className="inputGroup">
            <label className="label">Artifact Set:</label>
            <Select
              options={artifactSets.map((set) => ({ value: set, label: set }))}
              value={formData.artifactSet}
              onChange={(selected) => handleSelectChange(selected, 'artifactSet')}
              placeholder="Select or type to search"
              className="react-select"
              isClearable
            />
          </div>

          <div className="inputGroup">
            <label className="label">Artifact Type:</label>
            <Select
              options={artifactTypes}
              value={formData.type}
              onChange={(selected) => handleSelectChange(selected, 'type')}
              placeholder="Select or type to search"
              className="react-select"
              isClearable
            />
          </div>

          <div className="inputGroup">
            <label className="label">Main Stat:</label>
            <Select
              options={formData.type ? mainStatsOptions[formData.type.value] : []}
              value={formData.mainStat}
              onChange={(selected) => handleSelectChange(selected, 'mainStat')}
              placeholder={formData.type ? "Select or type to search" : "Select Artifact Type first"}
              isDisabled={!formData.type}
              className="react-select"
              isClearable
            />
          </div>

          <div className="inputGroup">
            <label className="label">Number of Substats:</label>
            <select
              name="numberOfSubstats"
              value={formData.numberOfSubstats}
              onChange={handleInputChange}
              className="select"
            >
              <option value="">Select Number</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="inputGroup">
            <label className="label">Substats:</label>
            <div>
              {filteredSubstats.map((substat) => (
                <label key={substat} className="checkboxLabel">
                  <input
                    type="checkbox"
                    name="substats"
                    value={substat}
                    checked={formData.substats.includes(substat)}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  {substat}
                </label>
              ))}
            </div>
          </div>

          <div className="inputGroup">
            <label className="label">Score:</label>
            <select name="score" value={formData.score} onChange={handleInputChange} className="select">
              <option value="">Select Score</option>
              {scores.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </div>

          <div className="inputGroup">
            <label className="label">Where Got It:</label>
            <select name="source" value={formData.source} onChange={handleInputChange} className="select">
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="button" onClick={handleSave} disabled={isSaveDisabled}>
              Save
            </button>
            <button type="button" className="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
      
      
    
  );
};

export default EditArtifactModal;