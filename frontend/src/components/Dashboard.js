import React, { useState, useEffect } from 'react';
import { getOpportunityStats, getOpportunities } from '../services/api';
import { formatCurrency } from '../utils/formatters';
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
  const stageData = {
    labels: Object.keys(stats.stage_distribution),
    datasets: [
      {
        label: 'Opportunities by Stage',
        data: Object.values(stats.stage_distribution).map(stage => stage.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
          '#14B8A6',
          '#F97316',
        ],
        borderWidth: 0,
      },
    ],
  };

  const amountData = {
    labels: Object.keys(stats.stage_distribution),
    datasets: [
      {
        label: 'Total Amount by Stage',
        data: Object.values(stats.stage_distribution).map(stage => stage.total_amount),
        backgroundColor: '#3B82F6',
        borderColor: '#1D4ED8',
        borderWidth: 1,
      },
    ],
  };

  const recentOpportunities = opportunities
    .sort((a, b) => new Date(b._sync_timestamp) - new Date(a._sync_timestamp))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_opportunities}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_amount)}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Opps with Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_opportunities_with_services}</p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">📈</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Services Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.total_services_amount)}
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">📋</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Opportunities by Stage</h3>
          <div className="h-64">
            <Pie data={stageData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Pipeline Value by Stage</h3>
          <div className="h-64">
            <Bar 
              data={amountData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Opportunities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delta ARR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOpportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {opportunity.opportunity_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opportunity.account_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(opportunity.delta_average_arr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {opportunity.stage_number || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
