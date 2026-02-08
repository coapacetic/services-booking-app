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
