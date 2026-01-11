import React, { useState, useEffect } from 'react';
import { getDealsNeedingAttention } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const DealsNeedingAttention = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await getDealsNeedingAttention();
        setDeals(response.data);
      } catch (err) {
        console.error('Error fetching deals needing attention:', err);
        setError('Failed to load deals needing attention');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Deals Needing Attention</h3>
        <div className="text-center py-4 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Deals Needing Attention</h3>
        <div className="text-center py-4 text-red-500">{error}</div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Deals Needing Attention</h3>
        <div className="text-center py-4 text-gray-500">
          No deals currently need attention
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        Deals Needing Attention
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({deals.length} deal{deals.length !== 1 ? 's' : ''})
        </span>
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Stage 3+ deals with $100K+ ARR that need notes or services
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opportunity Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delta Average ARR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services Next Steps
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {deal.opportunity_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(deal.delta_average_arr)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(deal.services_attached_amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {deal.services_next_steps || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {deal.stage_number || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {deal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tag === 'Needs notes'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealsNeedingAttention;
