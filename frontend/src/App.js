import React, { useState } from "react";
import Select from "react-select"; // Import React-Select
import './App.css'; // Importing the styles

function App() {
  const [formData, setFormData] = useState({
    type: null, // Track selected artifact type
    mainStat: null, // Track selected main stat
    substats: [],
    numberOfSubstats: "",
    score: "",
    source: "",
    artifactSet: null, // Track selected artifact set
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  const isSubmitDisabled = () => {
    const { type, mainStat, numberOfSubstats, substats, score, source, artifactSet } = formData;
    return (
      !type ||
      !mainStat ||
      !numberOfSubstats ||
      !score ||
      !source ||
      !artifactSet ||
      substats.length !== parseInt(numberOfSubstats, 10)
    );
  };

  return (
    <div className="container">
      <h1>Artifact Input Form</h1>
      <form onSubmit={handleSubmit} className="form">

        <div className="inputGroup">
          <label className="label">Artifact Set:</label>
          <Select
            options={artifactSets.map((set) => ({ value: set, label: set }))}
            value={formData.artifactSet}
            onChange={(selected) => handleSelectChange(selected, "artifactSet")}
            placeholder="Select or type to search"
            className="react-select"
          />
        </div>


        <div className="inputGroup">
          <label className="label">Artifact Type:</label>
          <Select
            options={artifactTypes}
            value={formData.type}
            onChange={(selected) => handleSelectChange(selected, "type")}
            placeholder="Select or type to search"
            className="react-select"
          />
        </div>
        <div className="inputGroup">
          <label className="label">Main Stat:</label>
          <Select
            options={formData.type ? mainStatsOptions[formData.type.value] : []}
            value={formData.mainStat}
            onChange={(selected) => handleSelectChange(selected, "mainStat")}
            placeholder={formData.type ? "Select or type to search" : "Select Artifact Type first"}
            isDisabled={!formData.type}
            className="react-select"
          />
        </div>
        <div className="inputGroup">
          <label className="label">Number of Substats:</label>
          <select
            name="numberOfSubstats"
            value={formData.numberOfSubstats}
            onChange={handleInputChange}
            className="select"
            disabled={!formData.mainStat}
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
                  disabled={!formData.numberOfSubstats}
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
          <label className="label">Where Get It:</label>
          <select name="source" value={formData.source} onChange={handleInputChange} className="select">
            <option value="">Select Source</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" disabled={isSubmitDisabled()} className="submitButton">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
