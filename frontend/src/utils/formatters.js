export const formatCurrency = (amount) => {
  if (!amount) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A';
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStageColor = (stage) => {
  const stageColors = {
    'Prospecting': 'bg-primary-50 text-primary-900',
    'Qualification': 'bg-primary-100 text-primary-900',
    'Needs Analysis': 'bg-primary-200 text-primary-900',
    'Value Proposition': 'bg-primary-300 text-primary-900',
    'Proposal/Price Quote': 'bg-primary-400 text-white',
    'Negotiation/Review': 'bg-primary-600 text-white',
    'Closed Won': 'bg-primary-900 text-white',
    'Closed Lost': 'bg-primary-400 text-white',
  };
  return stageColors[stage] || 'bg-primary-100 text-primary-900';
};

export const getStageNumberColor = (stageNumber) => {
  const stageNum = parseInt(stageNumber, 10);
  if (isNaN(stageNum)) return 'bg-blue-100 text-blue-900';
  
  const stageColors = {
    1: 'bg-blue-100 text-blue-900',    // Lightest blue
    2: 'bg-blue-200 text-blue-900',    // Light blue
    3: 'bg-blue-300 text-blue-900',    // Medium light blue
    4: 'bg-blue-400 text-white',       // Medium blue
    5: 'bg-blue-600 text-white',       // Dark blue
  };
  
  return stageColors[stageNum] || 'bg-blue-100 text-blue-900';
};

export const getProbabilityColor = (probability) => {
  if (probability >= 80) return 'text-primary-700';
  if (probability >= 60) return 'text-primary-600';
  if (probability >= 40) return 'text-primary-500';
  return 'text-primary-400';
};

export const generateGrayscaleChartColors = (count = 8) => {
  const colors = [
    '#FAFAFA', // primary-50 (lightest)
    '#F5F5F5', // primary-100
    '#E5E5E5', // primary-200
    '#D4D4D4', // primary-300
    '#A3A3A3', // primary-400
    '#737373', // primary-500
    '#525252', // primary-600
    '#171717', // primary-900 (darkest)
  ];
  return colors.slice(0, count);
};

export const generateBlueChartColors = (count = 8) => {
  const colors = [
    '#dbeafe', // blue-100 (Stage 1)
    '#bfdbfe', // blue-200 (Stage 2)
    '#93c5fd', // blue-300 (Stage 3)
    '#60a5fa', // blue-400 (Stage 4)
    '#2563eb', // blue-600 (Stage 5)
    '#1e40af', // blue-800 (darker for additional stages)
    '#1e3a8a', // blue-900 (darkest for additional stages)
    '#eff6ff', // blue-50 (lightest for additional stages)
  ];
  return colors.slice(0, count);
};

export const getStageChartColors = (stageLabels) => {
  const stageColorMap = {
    // Numeric stages (from backend stage_distribution)
    '1': '#dbeafe',      // blue-100 (Stage 1)
    '2': '#bfdbfe',      // blue-200 (Stage 2)
    '3': '#93c5fd',      // blue-300 (Stage 3)
    '4': '#60a5fa',      // blue-400 (Stage 4)
    '5': '#2563eb',      // blue-600 (Stage 5)
    '6': '#1e40af',      // blue-800 (Stage 6)
    '7': '#1e3a8a',      // blue-900 (Stage 7)
    '8': '#dbeafe',      // blue-100 (reuse for Stage 8+)
    
    // Named stages (for future use)
    'Prospecting': '#dbeafe',      // blue-100
    'Qualification': '#bfdbfe',    // blue-200
    'Needs Analysis': '#93c5fd',   // blue-300
    'Value Proposition': '#60a5fa', // blue-400
    'Proposal/Price Quote': '#2563eb', // blue-600
    'Negotiation/Review': '#1e40af',   // blue-800
    'Closed Won': '#1e3a8a',       // blue-900
    'Closed Lost': '#dbeafe',      // blue-100 (reuse lightest)
  };
  
  return stageLabels.map(stage => stageColorMap[stage] || '#dbeafe');
};
