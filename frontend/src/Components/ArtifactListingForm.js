// src/Components/ArtifactItem.js
import React from 'react';



const ArtifactListingForm = ({ artifact }) => {
  const renderCheckbox = (value) => (
    <input type="checkbox" checked={value === 1} readOnly />
  );
  return (
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
    </tr>
  );
};

export default ArtifactListingForm;