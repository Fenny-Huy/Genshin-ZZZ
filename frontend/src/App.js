import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    type: "",
    mainStat: "",
    substats: [],
    numberOfSubstats: "",
    score: "",
    source: "",
  });

  const artifactTypes = {
    "Flower": ["HP"],
    "Plume": ["ATK"],
    "Sand": ["%HP", "%ATK", "%DEF", "ER", "EM"],
    "Goblet": ["%HP", "%ATK", "%DEF", "EM", "Physical", "Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo"],
    "Circlet": ["%HP", "%ATK", "%DEF", "EM", "Crit Rate", "Crit DMG", "Healing"],
  };  

  const allSubstats = ["HP", "%HP", "ATK", "%ATK", "DEF", "%DEF", "ER", "EM", "Crit Rate", "Crit DMG"];

  const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat);

  const scores = ["Complete trash", "Trash", "Usable", "Good", "Excellent", "Marvelous", "Unknown"];
  const sources = ["Domain Farming", "Bosses", "Strongbox", "Spiral Abyss"];

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
        ...(name === "type" && { mainStat: "", substats: [], numberOfSubstats: "", score: "", source: "" }),
        ...(name === "mainStat" && { substats: [] }),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  const isSubmitDisabled = () => {
    const { type, mainStat, numberOfSubstats, substats, score, source } = formData;
    return (
      !type ||
      !mainStat ||
      !numberOfSubstats ||
      !score ||
      !source ||
      substats.length !== parseInt(numberOfSubstats, 10)
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Artifact Input Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Artifact Type:
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="">Select Type</option>
              {Object.keys(artifactTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Main Stat:
            <select
              name="mainStat"
              value={formData.mainStat}
              onChange={handleInputChange}
              disabled={!formData.type}
            >
              <option value="">Select Main Stat</option>
              {formData.type &&
                artifactTypes[formData.type].map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Number of Substats:
            <select
              name="numberOfSubstats"
              value={formData.numberOfSubstats}
              onChange={handleInputChange}
              disabled={!formData.mainStat}
            >
              <option value="">Select Number</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
        </div>
        <div>
          <label>Substats:</label>
          <div>
            {filteredSubstats.map((substat) => (
              <label key={substat} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  name="substats"
                  value={substat}
                  checked={formData.substats.includes(substat)}
                  onChange={handleInputChange}
                  disabled={!formData.numberOfSubstats}
                />
                {substat}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>
            Score:
            <select name="score" value={formData.score} onChange={handleInputChange}>
              <option value="">Select Score</option>
              {scores.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Where Get It:
            <select name="source" value={formData.source} onChange={handleInputChange}>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" disabled={isSubmitDisabled()}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
