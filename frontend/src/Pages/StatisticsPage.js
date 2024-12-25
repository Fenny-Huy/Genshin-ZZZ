import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './StatisticsPage.css'; // Import the CSS file
import config from '../config/config'; // Import the configuration file

const StatisticsPage = () => {
  const [typeData, setTypeData] = useState([]);
  const [mainStatData, setMainStatData] = useState([]);
  const [substatData, setSubstatData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Types');
  const [selectedCategory, setSelectedCategory] = useState('Main Stat');
  const [selectedSubstatChart, setSelectedSubstatChart] = useState('Overall');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMainStat, setSelectedMainStat] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/statistics/mainstat`);
        console.log('API Response:', response.data); // Log the API response
        setTypeData(response.data.type_percentages);
        setMainStatData(response.data.main_stat_percentages);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchSubstatStatistics = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/statistics/substats`);
        console.log('Substat API Response:', response.data); // Log the API response
        setSubstatData(response.data);
      } catch (error) {
        console.error('Error fetching substat statistics:', error);
      }
    };

    fetchSubstatStatistics();
  }, []);

  useEffect(() => {
    console.log('Type Data:', typeData); // Log type data
    console.log('Main Stat Data:', mainStatData); // Log main stat data
    console.log('Substat Data:', substatData); // Log substat data
  }, [typeData, mainStatData, substatData]);

  const prepareChartData = (data, labelKey, valueKey) => {
    // Sort data in descending order based on the value
    const sortedData = data.sort((a, b) => b[valueKey] - a[valueKey]);

    return {
      labels: sortedData.map(item => item[labelKey]),
      datasets: [
        {
          data: sortedData.map(item => item[valueKey]),
          backgroundColor: [
            '#FF0000',  // Bright red  
            '#00FF00',  // Bright green  
            '#0000FF',  // Bright blue  
            '#FFFF00',  // Bright yellow  
            '#FF00FF',  // Magenta  
            '#00FFFF',  // Cyan  
            '#FFA500',  // Orange  
            '#800080',  // Purple  
            '#008000',  // Dark green  
            '#000080',  // Navy blue  
            '#A52A2A',  // Brown  
            '#808080',  // Gray  
            '#FFC0CB',  // Pink  
            '#FFD700',  // Gold  
            '#008080',  // Teal  
          ],
        },
      ],
    };
  };

  const renderChart = () => {
    if (selectedChart === 'Types') {
      return (
        <div className="chart-container">
          <h2>Type Percentages</h2>
          <div className="pie-chart">
            <Pie data={prepareChartData(typeData.map(item => ({ Type: item[0], percentage: item[1] })), 'Type', 'percentage')} />
          </div>
        </div>
      );
    } else {
      const data = mainStatData.filter(item => item[0] === selectedChart);
      return (
        <div className="chart-container">
          <h2>{selectedChart} Main Stat Percentages</h2>
          <div className="pie-chart">
            <Pie data={prepareChartData(data.map(item => ({ 'Main Stat': item[1], percentage: item[2] })), 'Main Stat', 'percentage')} />
          </div>
        </div>
      );
    }
  };

  const renderTable = () => {
    if (selectedChart === 'Types') {
      const sortedTypeData = [...typeData].sort((a, b) => b[2] - a[2]);
      const totalCount = sortedTypeData.reduce((sum, item) => sum + item[2], 0);
      const totalPercentage = sortedTypeData.reduce((sum, item) => sum + item[1], 0);
      return (
        <div className="table-container">
          <h2>Type Counts</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Percentage</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {sortedTypeData.map(item => (
                <tr key={item[0]}>
                  <td>{item[0]}</td>
                  <td>{item[1].toFixed(2)}%</td>
                  <td>{item[2]}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{totalPercentage.toFixed(2)}%</strong></td>
                <td><strong>{totalCount}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      const sortedMainStatData = mainStatData.filter(item => item[0] === selectedChart).sort((a, b) => b[3] - a[3]);
      const totalCount = sortedMainStatData.reduce((sum, item) => sum + item[3], 0);
      const totalPercentage = sortedMainStatData.reduce((sum, item) => sum + item[2], 0);
      return (
        <div className="table-container">
          <h2>{selectedChart} Main Stat Counts</h2>
          <table>
            <thead>
              <tr>
                <th>Main Stat</th>
                <th>Percentage</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {sortedMainStatData.map(item => (
                <tr key={item[1]}>
                  <td>{item[1]}</td>
                  <td>{item[2].toFixed(2)}%</td>
                  <td>{item[3]}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{totalPercentage.toFixed(2)}%</strong></td>
                <td><strong>{totalCount}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  const renderSubstatOverall = () => {
    const substatKeyToMainStat = {
      sub_ATK_per: '%ATK',
      sub_HP_per: '%HP',
      sub_DEF_per: '%DEF',
      sub_ATK: 'ATK',
      sub_HP: 'HP',
      sub_DEF: 'DEF',
      sub_ER: 'ER',
      sub_EM: 'EM',
      sub_Crit_Rate: 'Crit Rate',
      sub_Crit_DMG: 'Crit DMG',
    };

    const substatTotals = substatData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('sub_') && item.main_stat !== substatKeyToMainStat[key]) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});

    const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
      acc[key] = substatData.reduce((sum, item) => {
        if (item.main_stat !== substatKeyToMainStat[key]) {
          return sum + item.ArtifactCount; //replace this with either substatCount or ArtifactCount
        }
        return sum;
      }, 0);
      return acc;
    }, {});

    const substatDistribution = Object.keys(substatTotals).map(key => ({
      substat: substatKeyToMainStat[key],
      percentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
      count: substatTotals[key],
    }));

    return (
      <div className="substat-chart-table-container">
        <div className="chart-container">
          <h2>Substat Distribution</h2>
          <div className="bar-chart">
            <Bar data={prepareChartData(substatDistribution, 'substat', 'percentage')} />
          </div>
        </div>
        <div className="table-container">
          <h2>Substat Counts</h2>
          <table>
            <thead>
              <tr>
                <th>Substat</th>
                <th>Percentage</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {substatDistribution.map(item => (
                <tr key={item.substat}>
                  <td>{item.substat}</td>
                  <td>{item.percentage.toFixed(2)}%</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{substatDistribution.reduce((sum, item) => sum + item.percentage, 0).toFixed(2)}%</strong></td>
                <td><strong>{Object.values(substatTotals).reduce((sum, count) => sum + count, 0)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSubstatSpecific = () => {
    const substatKeyToMainStat = {
      sub_ATK_per: '%ATK',
      sub_HP_per: '%HP',
      sub_DEF_per: '%DEF',
      sub_ATK: 'ATK',
      sub_HP: 'HP',
      sub_DEF: 'DEF',
      sub_ER: 'ER',
      sub_EM: 'EM',
      sub_Crit_Rate: 'Crit Rate',
      sub_Crit_DMG: 'Crit DMG',
    };
    const handleTypeSelection = (type) => {
      setSelectedType(type);
      setSelectedMainStat(null); // Reset selectedMainStat when changing the selectedType
    };

    const data = substatData.find(item => item.type === selectedType && item.main_stat === selectedMainStat);
    const substatDistribution = data ? Object.keys(data).filter(key => key.startsWith('sub_')).map(key => ({
      substat: substatKeyToMainStat[key],
      percentage: (data[key] / data.substatCount) * 100, //replace this with either substatCount or ArtifactCount
      count: data[key],
    })) : [];

    const totalPercentage = substatDistribution.reduce((sum, item) => sum + item.percentage, 0);

    return (
      <div className="substat-content-container">
        <div className="button-container">
          {typeData.map(item => (
            <button
              key={item[0]}
              className={selectedType === item[0] ? 'active' : ''}
              onClick={() => handleTypeSelection(item[0])}
            >
              {item[0]}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className="button-container">
            {mainStatData.filter(item => item[0] === selectedType).map(item => (
              <button
                key={item[1]}
                className={selectedMainStat === item[1] ? 'active' : ''}
                onClick={() => setSelectedMainStat(item[1])}
              >
                {item[1]}
              </button>
            ))}
          </div>
        )}
        {selectedType && selectedMainStat && (
          <div className="substat-chart-table-container">
            <div className="chart-container">
              <h2>{selectedType} - {selectedMainStat} Substat Distribution</h2>
              <div className="pie-chart">
                <Pie data={prepareChartData(substatDistribution, 'substat', 'percentage')} />
              </div>
            </div>
            <div className="table-container">
              <h2>{selectedType} - {selectedMainStat} Substat Counts</h2>
              <table>
                <thead>
                  <tr>
                    <th>Substat</th>
                    <th>Percentage</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {substatDistribution.map(item => (
                    <tr key={item.substat}>
                      <td>{item.substat}</td>
                      <td>{item.percentage.toFixed(2)}%</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{totalPercentage.toFixed(2)}%</strong></td>
                    <td><strong>{data.substatCount}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (selectedCategory === 'Main Stat') {
      return (
        <>
          <div className="button-container">
            <button className={selectedChart === 'Types' ? 'active' : ''} onClick={() => setSelectedChart('Types')}>Types</button>
            <button className={selectedChart === 'Sand' ? 'active' : ''} onClick={() => setSelectedChart('Sand')}>Sand</button>
            <button className={selectedChart === 'Goblet' ? 'active' : ''} onClick={() => setSelectedChart('Goblet')}>Goblet</button>
            <button className={selectedChart === 'Circlet' ? 'active' : ''} onClick={() => setSelectedChart('Circlet')}>Circlet</button>
          </div>
          <div className="mainstat-content-container">
            {renderChart()}
            {renderTable()}
          </div>
        </>
      );
    } else if (selectedCategory === 'Substats') {
      return (
        <>
          <div className="button-container">
            <button className={selectedSubstatChart === 'Overall' ? 'active' : ''} onClick={() => setSelectedSubstatChart('Overall')}>Overall</button>
            <button className={selectedSubstatChart === 'Specific' ? 'active' : ''} onClick={() => setSelectedSubstatChart('Specific')}>Specific</button>
          </div>
          {selectedSubstatChart === 'Overall' && renderSubstatOverall()}
          {selectedSubstatChart === 'Specific' && renderSubstatSpecific()}
        </>
      );
    }
  };

  return (
    <div className="statistics-page">
      <h1>Artifact Statistics</h1>
      <div className="button-container">
        <button className={selectedCategory === 'Main Stat' ? 'active' : ''} onClick={() => setSelectedCategory('Main Stat')}>Main Stat</button>
        <button className={selectedCategory === 'Substats' ? 'active' : ''} onClick={() => setSelectedCategory('Substats')}>Substats</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StatisticsPage;