import React, { useState, useEffect } from 'react';
import { getOpportunityStats, getOpportunities } from '../services/api';
import { formatCurrency, generateGrayscaleChartColors, generateBlueChartColors, getStageNumberColor, getStageChartColors } from '../utils/formatters';
import '../utils/chartConfig';
import DealsNeedingAttention from './DealsNeedingAttention';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  QueueListIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  CalculatorIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, opportunitiesResponse] = await Promise.all([
          getOpportunityStats(),
          getOpportunities({ limit: 100 }),
        ]);
        setStats(statsResponse.data);
        setOpportunities(opportunitiesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Unable to load dashboard data</div>;
  }

  // Prepare chart data
  const stageCount = Object.keys(stats.stage_distribution).length;
  const grayscaleColors = generateGrayscaleChartColors(stageCount);
  const blueColors = generateBlueChartColors(stageCount);
  const stageLabels = Object.keys(stats.stage_distribution);
  const stageSpecificColors = getStageChartColors(stageLabels);
  
  // Debug: Log the colors to verify they're being generated correctly
  console.log('Stage Labels:', stageLabels);
  console.log('Stage Specific Colors:', stageSpecificColors);

  const stageData = {
    labels: stageLabels,
    datasets: [
      {
        label: 'Opportunities by Stage',
        data: Object.values(stats.stage_distribution).map(stage => stage.count),
        backgroundColor: stageSpecificColors,
        borderColor: '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  const amountData = {
    labels: stageLabels,
    datasets: [
      {
        label: 'Total Amount by Stage',
        data: Object.values(stats.stage_distribution).map(stage => stage.total_amount),
        backgroundColor: stageSpecificColors,
        borderColor: '#FFFFFF',
        borderWidth: 0.5,
      },
    ],
  };

  const recentOpportunities = opportunities
    .sort((a, b) => new Date(b._sync_timestamp) - new Date(a._sync_timestamp))
    .slice(0, 5);

  const topDeals = opportunities
    .filter(opp => {
      const stageNum = parseInt(opp.stage_number, 10);
      return !isNaN(stageNum) && stageNum >= 3;
    })
    .sort((a, b) => b.delta_average_arr - a.delta_average_arr)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-primary-900">{stats.total_opportunities}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-100 border border-blue-900 flex items-center justify-center">
                <QueueListIcon className="h-6 w-6 text-blue-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-primary-900">{formatCurrency(stats.total_amount)}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-200 border border-blue-900 flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Total Opps with Services</p>
              <p className="text-2xl font-bold text-primary-900">{stats.total_opportunities_with_services}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-300 border border-blue-900 flex items-center justify-center">
                <CheckBadgeIcon className="h-6 w-6 text-blue-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Total Services Amount</p>
              <p className="text-2xl font-bold text-primary-900">
                {formatCurrency(stats.total_services_amount)}
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-400 border border-blue-900 flex items-center justify-center">
                <CalculatorIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Attach Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Services Logo Attach Rate (Stage 3+)</p>
              <p className="text-2xl font-bold text-primary-900">
                {stats.services_logo_attach_rate?.toFixed(1) ?? '0.0'}%
              </p>
              <p className="text-xs text-primary-500 mt-1">Opportunities with services / Total opportunities</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-500 border border-blue-900 flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-600">Services Dollar Attach Rate (Stage 3+)</p>
              <p className="text-2xl font-bold text-primary-900">
                {stats.services_dollar_attach_rate?.toFixed(1) ?? '0.0'}%
              </p>
              <p className="text-xs text-primary-500 mt-1">Services amount / Delta average ARR</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-600 border border-blue-900 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-serif font-semibold text-primary-900 mb-4">Opportunities by Stage</h3>
          <div className="h-64">
            <Pie data={stageData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-serif font-semibold text-primary-900 mb-4">Pipeline Value by Stage</h3>
          <div className="h-64">
            <Bar
              data={amountData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: '#E5E5E5',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#525252',
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: '#525252',
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Deals */}
      <div className="card">
        <h3 className="text-lg font-serif font-semibold text-primary-900 mb-4">Top Deals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-primary-50 border-y border-hairline border-primary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Opportunity Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Delta Average ARR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Services Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Services Next Steps
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-200">
              {topDeals.length > 0 ? (
                topDeals.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-primary-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                      {opportunity.opportunity_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                      {formatCurrency(opportunity.delta_average_arr)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                      {formatCurrency(opportunity.services_attached_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold border border-blue-900 ${getStageNumberColor(opportunity.stage_number)}`}>
                        {opportunity.stage_number || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-600">
                      {opportunity.services_next_steps || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-primary-600">
                    No deals in stage 3 or later
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deals Needing Attention */}
      <DealsNeedingAttention />
      {/* Recent Opportunities */}
      <div className="card">
        <h3 className="text-lg font-serif font-semibold text-primary-900 mb-4">Recent Opportunities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-primary-50 border-y border-hairline border-primary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Delta ARR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-200">
              {recentOpportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-primary-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                    {opportunity.opportunity_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {opportunity.account_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {formatCurrency(opportunity.delta_average_arr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold border border-blue-900 ${getStageNumberColor(opportunity.stage_number)}`}>
                      {opportunity.stage_number || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {new Date(opportunity._sync_timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
