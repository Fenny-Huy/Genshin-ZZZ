// SubStatistics calculation utilities

interface SetData {
  set: string | null;
  count: number;
}

interface SourceData {
  where: string | null;
  count: number;
}

interface SetSourceComboData {
  set: string | null;
  where: string | null;
  count: number;
}

interface ChartData {
  label: string;
  substat?: string;
  percentage: number;
  count: number;
}

interface TableData {
  substat: string;
  percentage: number;
  count: number;
}

// Set/Source calculations
export const calculateSetSourceData = (combineCap = 3.5) => {
  const prepareTableSetData = (data: SetData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetData = (data: SetData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
      label: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareSourceData = (data: SourceData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where ?? 'Unknown',
      substat: item.where ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetSpecificData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set ?? 'Unknown',
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
      label: 'Other',
      substat: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareTableSetSpecificData = (data: SetSourceComboData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareSourceSpecificData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where ?? 'Unknown',
      substat: item.where ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareTableSetSourceComboData = (data: SetSourceComboData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.set ?? 'Unknown'} - ${item.where ?? 'Unknown'}`,
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetSourceComboData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: `${item.set ?? 'Unknown'} - ${item.where ?? 'Unknown'}`,
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
      label: 'Other',
      substat: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  return {
    prepareTableSetData,
    prepareChartSetData,
    prepareSourceData,
    prepareChartSetSpecificData,
    prepareTableSetSpecificData,
    prepareSourceSpecificData,
    prepareTableSetSourceComboData,
    prepareChartSetSourceComboData,
  };
};
