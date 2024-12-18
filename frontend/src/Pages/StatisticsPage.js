import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './StatisticsPage.css'; // Import the CSS file

const StatisticsPage = () => {
  const [typeData, setTypeData] = useState([]);
  const [mainStatData, setMainStatData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/statistics/mainstat');
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
    console.log('Type Data:', typeData); // Log type data
    console.log('Main Stat Data:', mainStatData); // Log main stat data
  }, [typeData, mainStatData]);

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

  const renderMainStatCharts = () => {
    const types = [...new Set(mainStatData.map(item => item[0]))].filter(type => type !== 'Plume' && type !== 'Flower');
    return types.map(type => {
      const data = mainStatData.filter(item => item[0] === type);
      return (
        <div key={type} className="chart-container">
          <h2>{type} Main Stat Percentages</h2>
          <div className="pie-chart">
            <Pie data={prepareChartData(data.map(item => ({ 'Main Stat': item[1], percentage: item[2] })), 'Main Stat', 'percentage')} />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="statistics-page">
      <h1>Artifact Statistics</h1>
      <div className="chart-container">
        <h2>Type Percentages</h2>
        <div className="pie-chart">
          <Pie data={prepareChartData(typeData.map(item => ({ Type: item[0], percentage: item[1] })), 'Type', 'percentage')} />
        </div>
      </div>
      {renderMainStatCharts()}
    </div>
  );
};

export default StatisticsPage;