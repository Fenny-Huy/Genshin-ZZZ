import React from 'react';
import ChartTable from '../ChartTable';
import { prepareChartData, transformMainStatData } from '../../utils/chartDataHelpers';
import styles from '../../Styles/Pages/StatisticsPage.module.css';

const MainStatSection = ({ 
  selectedChart, 
  setSelectedChart, 
  typeData, 
  mainStatData, 
  isLoading 
}) => {
  const data = transformMainStatData(typeData, mainStatData, selectedChart);

  return (
    <>
      <div className={styles.subButtonsContainer}>
        <button 
          className={`${styles.subButton} ${selectedChart === 'Types' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('Types')}
        >
          📋 Types
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === 'Sand' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('Sand')}
        >
          ⏳ Sand
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === 'Goblet' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('Goblet')}
        >
          🏺 Goblet
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === 'Circlet' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('Circlet')}
        >
          👑 Circlet
        </button>
      </div>
      <ChartTable
        chartType="pie"
        chartData={prepareChartData(data, 'substat', 'percentage')}
        tableData={data}
        chartTitle={selectedChart === 'Types' ? 'Type Distribution' : `${selectedChart} Main Stat Distribution`}
        tableTitle={selectedChart === 'Types' ? 'Type Counts' : `${selectedChart} Main Stat Counts`}
        tableFirstField={selectedChart === 'Types' ? 'Type' : 'Main Stat'}
        isLoading={isLoading}
      />
    </>
  );
};

export default MainStatSection;
