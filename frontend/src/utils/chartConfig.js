import Chart from 'chart.js/auto';

// Configure Chart.js for grayscale theme
Chart.defaults.color = '#525252'; // primary-600 for text
Chart.defaults.borderColor = '#E5E5E5'; // primary-200 for borders
// Remove global backgroundColor to allow dataset-specific colors

// Configure default options for all charts
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
Chart.defaults.font.size = 12;

// Configure legend
Chart.defaults.plugins.legend = {
  ...Chart.defaults.plugins.legend,
  labels: {
    color: '#525252', // primary-600
    usePointStyle: true,
    padding: 15,
  },
};

// Configure tooltip
Chart.defaults.plugins.tooltip = {
  ...Chart.defaults.plugins.tooltip,
  backgroundColor: 'rgba(23, 23, 23, 0.9)', // primary-900 with opacity
  titleColor: '#ffffff',
  bodyColor: '#ffffff',
  borderColor: '#A3A3A3', // primary-400
  borderWidth: 0.5,
  padding: 8,
};
