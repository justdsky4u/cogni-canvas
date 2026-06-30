import * as Papa from 'papaparse';

export interface DataRow {
  [key: string]: any;
}

export interface DataInsight {
  type: 'trend' | 'anomaly' | 'correlation' | 'summary';
  title: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  headers: string[];
  rows: DataRow[];
  summary: {
    totalRows: number;
    columnStats: Record<string, any>;
  };
  insights: DataInsight[];
  suggestedCharts: string[];
}

export const parseFile = (file: File): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as DataRow[];
        const analysis = analyzeData(headers, rows);
        resolve(analysis);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const analyzeData = (headers: string[], rows: DataRow[]): AnalysisResult => {
  const totalRows = rows.length;
  const columnStats: Record<string, any> = {};

  headers.forEach((header) => {
    const values = rows.map((row) => row[header]).filter((v) => v !== null && v !== undefined);
    const isNumeric = values.every((v) => typeof v === 'number');

    if (isNumeric && values.length > 0) {
      const numValues = values as number[];
      columnStats[header] = {
        type: 'numeric',
        min: Math.min(...numValues),
        max: Math.max(...numValues),
        avg: numValues.reduce((a, b) => a + b, 0) / numValues.length,
      };
    } else {
      const counts: Record<string, number> = {};
      values.forEach((v) => {
        const strV = String(v);
        counts[strV] = (counts[strV] || 0) + 1;
      });
      columnStats[header] = {
        type: 'categorical',
        uniqueCount: Object.keys(counts).length,
        topValue: Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0],
      };
    }
  });

  const insights: DataInsight[] = generateInsights(headers, rows, columnStats);
  const suggestedCharts = suggestCharts(headers, columnStats);

  return {
    headers,
    rows,
    summary: {
      totalRows,
      columnStats,
    },
    insights,
    suggestedCharts,
  };
};

const generateInsights = (headers: string[], rows: DataRow[], stats: Record<string, any>): DataInsight[] => {
  const insights: DataInsight[] = [];

  // Summary insight
  insights.push({
    type: 'summary',
    title: 'Data Structure Identified',
    description: `Analyzed ${rows.length} records across ${headers.length} parameters. Detected ${Object.values(stats).filter(s => s.type === 'numeric').length} numeric and ${Object.values(stats).filter(s => s.type === 'categorical').length} categorical dimensions.`,
    relevance: 'high',
  });

  // Numeric trends
  Object.entries(stats).forEach(([header, stat]) => {
    if (stat.type === 'numeric') {
      insights.push({
        type: 'trend',
        title: `Dynamic Range in ${header}`,
        description: `Values for ${header} range from ${stat.min.toLocaleString()} to ${stat.max.toLocaleString()}, with an average of ${stat.avg.toLocaleString()}.`,
        relevance: 'medium',
      });
    }
  });

  // Anomalies (simple threshold check)
  Object.entries(stats).forEach(([header, stat]) => {
    if (stat.type === 'numeric') {
      const numValues = rows.map(r => r[header] as number);
      const mean = stat.avg;
      const stdDev = Math.sqrt(numValues.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / numValues.length);
      const anomalies = numValues.filter(x => Math.abs(x - mean) > stdDev * 2);
      
      if (anomalies.length > 0) {
        insights.push({
          type: 'anomaly',
          title: `Statistical Deviations in ${header}`,
          description: `Detected ${anomalies.length} potential outliers in ${header} that significantly deviate from the norm.`,
          relevance: 'high',
        });
      }
    }
  });

  return insights;
};

const suggestCharts = (headers: string[], stats: Record<string, any>): string[] => {
  const suggested: string[] = [];
  const numericCols = Object.keys(stats).filter(h => stats[h].type === 'numeric');
  const categoricalCols = Object.keys(stats).filter(h => stats[h].type === 'categorical');

  if (numericCols.length >= 1 && categoricalCols.length >= 1) {
    suggested.push('BarChart');
  }
  if (numericCols.length >= 2) {
    suggested.push('ScatterChart');
  }
  if (numericCols.length >= 1) {
    suggested.push('LineChart');
    suggested.push('AreaChart');
  }
  if (categoricalCols.length >= 1) {
    suggested.push('PieChart');
  }

  return suggested;
};
