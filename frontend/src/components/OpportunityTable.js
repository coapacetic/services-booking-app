import React, { useState, useEffect } from 'react';
import { getOpportunities, deleteOpportunity } from '../services/api';
import { formatCurrency, formatDate, getStageColor } from '../utils/formatters';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const OpportunityTable = ({ onEdit, onView }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    stage: '',
    account_name: '',
    min_amount: '',
    max_amount: '',
  });

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await getOpportunities(params);
      setOpportunities(response.data);
    } catch (err) {
      setError('Failed to fetch opportunities');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity(id);
        setOpportunities(prev => prev.filter(opp => opp.opportunty_id !== id));
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        alert('Failed to delete opportunity');
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-primary-600">Loading opportunities...</div>;
  if (error) return <div className="text-primary-700 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="card">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Filter Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="stage"
            placeholder="Stage"
            value={filters.stage}
            onChange={handleFilterChange}
            className="px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
          />
          <input
            type="text"
            name="account_name"
            placeholder="Account Name"
            value={filters.account_name}
            onChange={handleFilterChange}
            className="px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
          />
          <input
            type="number"
            name="min_amount"
            placeholder="Min Amount"
            value={filters.min_amount}
            onChange={handleFilterChange}
            className="px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
          />
          <input
            type="number"
            name="max_amount"
            placeholder="Max Amount"
            value={filters.max_amount}
            onChange={handleFilterChange}
            className="px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Apply Filters
        </button>
      </form>

      {/* Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Opportunities ({opportunities.length})</h3>
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
                Services Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Close Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-200">
            {opportunities.map((opportunity) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  {formatCurrency(opportunity.services_attached_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(opportunity.stage_number)}`}>
                    {opportunity.stage_number || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  {formatDate(opportunity.close_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  {opportunity.owner_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onView(opportunity)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(opportunity)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity.opportunty_id)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {opportunities.length === 0 && (
          <div className="text-center py-8 text-primary-600">
            No opportunities found
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityTable;
