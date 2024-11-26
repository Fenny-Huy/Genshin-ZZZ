// src/Components/ArtifactItem.js
import React from 'react';

const ArtifactListingForm = ({ artifact }) => {
  return (
    <tr>
      <td>{artifact.id}</td>
      <td>{artifact.set}</td>
      <td>{artifact.type}</td>
      <td>{artifact.main_stat}</td>
      <td>{artifact.number_of_substats}</td>
      <td>{artifact.atk_percent}</td>
      <td>{artifact.hp_percent}</td>
      <td>{artifact.def_percent}</td>
      <td>{artifact.atk}</td>
      <td>{artifact.hp}</td>
      <td>{artifact.defense}</td>
      <td>{artifact.er}</td>
      <td>{artifact.em}</td>
      <td>{artifact.crit_rate}</td>
      <td>{artifact.crit_dmg}</td>
      <td>{artifact.where_got_it}</td>
      <td>{artifact.score}</td>
    </tr>
  );
};

export default ArtifactListingForm;