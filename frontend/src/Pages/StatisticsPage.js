import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartTable from '../Components/ChartTable'; // Import the new component
import '../Styles/Pages.css';
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
        
        setSubstatData(response.data);
      } catch (error) {
        console.error('Error fetching substat statistics:', error);
      }
    };

    fetchSubstatStatistics();
  }, []);

  

  const prepareChartData = (data, labelKey, valueKey) => {
    // Sort data in descending order based on the value
    const sortedData = data.sort((a, b) => b[valueKey] - a[valueKey]);

    const colors = [
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
    ];

    return {
      labels: sortedData.map(item => item[labelKey]),
      datasets: [
        {
          data: sortedData.map(item => item[valueKey]),
          backgroundColor: colors.slice(0, sortedData.length),
        },
      ],
    };
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
          return sum + item.ArtifactCount;
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
      <ChartTable
        chartType="bar"
        chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
        tableData={substatDistribution}
        chartTitle="Substat Distribution"
        tableTitle="Substat Counts"
        tableFirstField="Substat"
      />
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
      percentage: (data[key] / data.substatCount) * 100,
      count: data[key],
    })) : [];

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
          <ChartTable
            chartType="pie"
            chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
            tableData={substatDistribution}
            chartTitle={`${selectedType} - ${selectedMainStat} Substat Distribution`}
            tableTitle={`${selectedType} - ${selectedMainStat} Substat Counts`}
            tableFirstField="Substat"
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (selectedCategory === 'Main Stat') {
      const data = selectedChart === 'Types'
        ? typeData.map(item => ({ substat: item[0], percentage: item[1], count: item[2] }))
        : mainStatData.filter(item => item[0] === selectedChart).map(item => ({ substat: item[1], percentage: item[2], count: item[3] }));

      return (
        <>
          <div className="button-container">
            <button className={selectedChart === 'Types' ? 'active' : ''} onClick={() => setSelectedChart('Types')}>Types</button>
            <button className={selectedChart === 'Sand' ? 'active' : ''} onClick={() => setSelectedChart('Sand')}>Sand</button>
            <button className={selectedChart === 'Goblet' ? 'active' : ''} onClick={() => setSelectedChart('Goblet')}>Goblet</button>
            <button className={selectedChart === 'Circlet' ? 'active' : ''} onClick={() => setSelectedChart('Circlet')}>Circlet</button>
          </div>
          <ChartTable
            chartType="pie"
            chartData={prepareChartData(data, 'substat', 'percentage')}
            tableData={data}
            chartTitle={selectedChart === 'Types' ? 'Type Distribution' : `${selectedChart} Main Stat Distribution`}
            tableTitle={selectedChart === 'Types' ? 'Type Counts' : `${selectedChart} Main Stat Counts`}
            tableFirstField={selectedChart === 'Types' ? 'Type' : 'Main Stat'}
          />
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