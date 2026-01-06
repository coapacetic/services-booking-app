import React from 'react';
import { formatCurrency, formatDate, formatDateTime, getStageColor, getProbabilityColor } from '../utils/formatters';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const OpportunityDetail = ({ opportunity, onEdit, onClose }) => {
  if (!opportunity) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No opportunity selected</p>
      </div>
    );
  }

  const fields = [
    { label: 'Salesforce ID', value: opportunity.salesforce_id },
    { label: 'Opportunity Name', value: opportunity.name },
    { label: 'Account Name', value: opportunity.account_name || 'N/A' },
    { label: 'Amount', value: formatCurrency(opportunity.amount) },
    { label: 'Stage', value: opportunity.stage, isBadge: true },
    { label: 'Probability', value: opportunity.probability ? `${opportunity.probability}%` : 'N/A', isColored: true },
    { label: 'Close Date', value: formatDate(opportunity.close_date) },
    { label: 'Owner', value: opportunity.owner_name || 'N/A' },
    { label: 'Type', value: opportunity.type || 'N/A' },
    { label: 'Lead Source', value: opportunity.lead_source || 'N/A' },
    { label: 'Campaign', value: opportunity.campaign || 'N/A' },
    { label: 'Forecast Category', value: opportunity.forecast_category || 'N/A' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={onClose}
              className="mb-4 flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Opportunities
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{opportunity.name}</h2>
            <p className="text-gray-600 mt-1">{opportunity.account_name}</p>
          </div>
          <button
            onClick={() => onEdit(opportunity)}
            className="btn btn-primary inline-flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Amount</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(opportunity.amount)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Stage</p>
            <div className="mt-1">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                {opportunity.stage || 'N/A'}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Probability</p>
            <p className={`text-xl font-bold ${getProbabilityColor(opportunity.probability)}`}>
              {opportunity.probability}%
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunity Details</h3>
            <dl className="space-y-3">
              {fields.slice(0, 7).map((field) => (
                <div key={field.label} className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-600">{field.label}</dt>
                  <dd className="text-sm text-gray-900 text-right">
                    {field.isBadge ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(field.value)}`}>
                        {field.value}
                      </span>
                    ) : field.isColored ? (
                      <span className={`font-medium ${getProbabilityColor(opportunity.probability)}`}>
                        {field.value}
                      </span>
                    ) : (
                      field.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Information</h3>
            <dl className="space-y-3">
              {fields.slice(7).map((field) => (
                <div key={field.label} className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-600">{field.label}</dt>
                  <dd className="text-sm text-gray-900 text-right">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Description */}
        {opportunity.description && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatDateTime(opportunity.created_date)}
            </div>
            <div>
              <span className="font-medium">Last Modified:</span> {formatDateTime(opportunity.last_modified)}
            </div>
            <div>
              <span className="font-medium">Last Sync:</span> {formatDateTime(opportunity.sync_timestamp)}
            </div>
            <div>
              <span className="font-medium">ID:</span> {opportunity.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
