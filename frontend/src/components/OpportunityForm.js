import React, { useState, useEffect } from 'react';

const OpportunityForm = ({ opportunity, isEditing, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      salesforce_id: '',
      name: '',
      account_name: '',
      amount: '',
      stage: '',
      probability: '',
      close_date: '',
      owner_name: '',
      type: '',
      lead_source: '',
      campaign: '',
      description: '',
      forecast_category: '',
      in_manager_forecast: false,
      stage_number: '',
      stage_name: '',
      delta_average_arr: '',
      services_attached_amount: '',
      services_next_steps: '',
    });

  const [errors, setErrors] = useState({});

    useEffect(() => {
      if (opportunity && isEditing) {
        setFormData({
          salesforce_id: opportunity.salesforce_id || '',
          name: opportunity.name || '',
          account_name: opportunity.account_name || '',
          amount: opportunity.amount || '',
          stage: opportunity.stage || '',
          probability: opportunity.probability || '',
          close_date: opportunity.close_date || '',
          owner_name: opportunity.owner_name || '',
          type: opportunity.type || '',
          lead_source: opportunity.lead_source || '',
          campaign: opportunity.campaign || '',
          description: opportunity.description || '',
          forecast_category: opportunity.forecast_category || '',
          in_manager_forecast: opportunity.in_manager_forecast || false,
          stage_number: opportunity.stage_number || '',
          stage_name: opportunity.stage_name || '',
          delta_average_arr: opportunity.delta_average_arr || '',
          services_attached_amount: opportunity.services_attached_amount || '',
          services_next_steps: opportunity.services_next_steps || '',
        });
      }
    }, [opportunity, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.salesforce_id.trim()) {
      newErrors.salesforce_id = 'Salesforce ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required';
    }
    if (formData.amount && isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a valid number';
    }
    if (formData.probability && (isNaN(formData.probability) || formData.probability < 0 || formData.probability > 100)) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        const submissionData = {
          ...formData,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          probability: formData.probability ? parseInt(formData.probability) : null,
          close_date: formData.close_date || null,
          stage_number: formData.stage_number ? parseInt(formData.stage_number) : null,
          delta_average_arr: formData.delta_average_arr ? parseFloat(formData.delta_average_arr) : null,
          services_attached_amount: formData.services_attached_amount ? parseFloat(formData.services_attached_amount) : null,
          services_next_steps: formData.services_next_steps || null,
          stage_name: formData.stage_name || null,
        };
        onSubmit(submissionData);
      }
    };

  const stages = [
    'Prospecting',
    'Qualification',
    'Needs Analysis',
    'Value Proposition',
    'Proposal/Price Quote',
    'Negotiation/Review',
    'Closed Won',
    'Closed Lost',
  ];

  const types = ['New Business', 'Existing Business', 'Renewal'];
  const leadSources = ['Web', 'Phone', 'Email', 'Conference', 'Trade Show', 'Referral'];
  const forecastCategories = ['Pipeline', 'Forecast', 'Commit', 'Closed', 'Omitted'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h2>
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salesforce ID *
                </label>
                <input
                  type="text"
                  name="salesforce_id"
                  value={formData.salesforce_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isEditing}
                />
                {errors.salesforce_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.salesforce_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probability (%)
                </label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0-100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.probability && (
                  <p className="mt-1 text-sm text-red-600">{errors.probability}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sales Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Stage</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Close Date
                </label>
                <input
                  type="date"
                  name="close_date"
                  value={formData.close_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Source
                </label>
                <select
                  name="lead_source"
                  value={formData.lead_source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Lead Source</option>
                  {leadSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forecast Category
                </label>
                <select
                  name="forecast_category"
                  value={formData.forecast_category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Category</option>
                  {forecastCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign
              </label>
              <input
                type="text"
                name="campaign"
                value={formData.campaign}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    {/* Services & Forecasting */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Services & Forecasting</h3>
            
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="in_manager_forecast"
                            checked={formData.in_manager_forecast}
                            onChange={(e) => setFormData(prev => ({ ...prev, in_manager_forecast: e.target.checked }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm font-medium text-gray-700">
                            In Manager Forecast
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage Number
                          </label>
                          <input
                            type="number"
                            name="stage_number"
                            value={formData.stage_number}
                            onChange={handleChange}
                            placeholder="1-10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage Name
                          </label>
                          <input
                            type="text"
                            name="stage_name"
                            value={formData.stage_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delta Average ARR
                          </label>
                          <input
                            type="number"
                            name="delta_average_arr"
                            value={formData.delta_average_arr}
                            onChange={handleChange}
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Services + Attached Services Amount
                          </label>
                          <input
                            type="number"
                            name="services_attached_amount"
                            value={formData.services_attached_amount}
                            onChange={handleChange}
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Services Next Steps
                        </label>
                        <textarea
                          name="services_next_steps"
                          value={formData.services_next_steps}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Update Opportunity' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
