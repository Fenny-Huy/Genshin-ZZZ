// src/Pages/SearchArtifacts.js
import React, { useState } from 'react';
import axios from 'axios';
import ArtifactSearchForm from '../Components/ArtifactSearchForm';
import ArtifactListingForm from '../Components/ArtifactListingForm';

const SearchArtifacts = () => {
  const [formData, setFormData] = useState({
    artifactSet: null,
    type: null,
    mainStat: null,
    substats: [],
    numberOfSubstats: "",
    score: "",
    source: ""
  });
  const [artifacts, setArtifacts] = useState([]);

  const artifactTypes = [
    { value: "Flower", label: "Flower" },
    { value: "Plume", label: "Plume" },
    { value: "Sand", label: "Sand" },
    { value: "Goblet", label: "Goblet" },
    { value: "Circlet", label: "Circlet" },
  ];

  const mainStatsOptions = {
    Flower: [{ value: "HP", label: "HP" }],
    Plume: [{ value: "ATK", label: "ATK" }],
    Sand: [
      { value: "%HP", label: "%HP" },
      { value: "%ATK", label: "%ATK" },
      { value: "%DEF", label: "%DEF" },
      { value: "ER", label: "ER" },
      { value: "EM", label: "EM" },
    ],
    Goblet: [
      { value: "%HP", label: "%HP" },
      { value: "%ATK", label: "%ATK" },
      { value: "%DEF", label: "%DEF" },
      { value: "EM", label: "EM" },
      { value: "Physical", label: "Physical" },
      { value: "Anemo", label: "Anemo" },
      { value: "Geo", label: "Geo" },
      { value: "Electro", label: "Electro" },
      { value: "Dendro", label: "Dendro" },
      { value: "Hydro", label: "Hydro" },
      { value: "Pyro", label: "Pyro" },
      { value: "Cryo", label: "Cryo" },
    ],
    Circlet: [
      { value: "%HP", label: "%HP" },
      { value: "%ATK", label: "%ATK" },
      { value: "%DEF", label: "%DEF" },
      { value: "EM", label: "EM" },
      { value: "Crit Rate", label: "Crit Rate" },
      { value: "Crit DMG", label: "Crit DMG" },
      { value: "Healing", label: "Healing" },
    ],
  };

  const allSubstats = ["HP", "%HP", "ATK", "%ATK", "DEF", "%DEF", "ER", "EM", "Crit Rate", "Crit DMG"];
  const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat?.value);

  const scores = ["Complete trash", "Trash", "Usable", "Good", "Excellent", "Marvelous", "Unknown"];
  const sources = ["Domain Farming", "Bosses", "Strongbox", "Spiral Abyss"];

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
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption,
      ...(field === "type" && { mainStat: null, substats: [], numberOfSubstats: "" }),
      ...(field === "mainStat" && { substats: [] }),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    const payload = {
      set: formData.artifactSet?.value || null,
      type: formData.type?.value || null,
      main_stat: formData.mainStat?.value || null,
      number_of_substats: formData.numberOfSubstats || null,
      atk_percent: formData.substats.includes("%ATK") ? 1 : null,
      hp_percent: formData.substats.includes("%HP") ? 1 : null,
      def_percent: formData.substats.includes("%DEF") ? 1 : null,
      atk: formData.substats.includes("ATK") ? 1 : null,
      hp: formData.substats.includes("HP") ? 1 : null,
      defense: formData.substats.includes("DEF") ? 1 : null,
      er: formData.substats.includes("ER") ? 1 : null,
      em: formData.substats.includes("EM") ? 1 : null,
      crit_rate: formData.substats.includes("Crit Rate") ? 1 : null,
      crit_dmg: formData.substats.includes("Crit DMG") ? 1 : null,
      where_got_it: formData.source,
      score: formData.score,
    };

    try {
      const response = await axios.get('http://localhost:8000/search_artifacts/', {
        params: payload
      });
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error searching artifacts:', error);
    }
  };

  return (
    <div>
      <div className='container'>
      <h1>Search Artifacts</h1>
      <ArtifactSearchForm
        formData={formData}
        handleSubmit={handleSearch}
        artifactTypes={artifactTypes}
        mainStatsOptions={mainStatsOptions}
        filteredSubstats={filteredSubstats}
        scores={scores}
        sources={sources}
        artifactSets={artifactSets}
        handleSelectChange={handleSelectChange}
        handleInputChange={handleInputChange}
      />
      </div>
      <table className="artifact-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Set</th>
            <th>Type</th>
            <th>Main Stat</th>
            <th>Number of Substats</th>
            <th>%ATK</th>
            <th>%HP</th>
            <th>%DEF</th>
            <th>ATK</th>
            <th>HP</th>
            <th>DEF</th>
            <th>ER</th>
            <th>EM</th>
            <th>Crit Rate</th>
            <th>Crit DMG</th>
            <th>Source</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact, index) => (
            <ArtifactListingForm key={index} artifact={artifact} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchArtifacts;