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
    'Prospecting': 'bg-gray-100 text-gray-800',
    'Qualification': 'bg-blue-100 text-blue-800',
    'Needs Analysis': 'bg-indigo-100 text-indigo-800',
    'Value Proposition': 'bg-purple-100 text-purple-800',
    'Proposal/Price Quote': 'bg-yellow-100 text-yellow-800',
    'Negotiation/Review': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-green-100 text-green-800',
    'Closed Lost': 'bg-red-100 text-red-800',
  };
  return stageColors[stage] || 'bg-gray-100 text-gray-800';
};

export const getProbabilityColor = (probability) => {
  if (probability >= 80) return 'text-green-600';
  if (probability >= 60) return 'text-yellow-600';
  if (probability >= 40) return 'text-orange-600';
  return 'text-red-600';
};
