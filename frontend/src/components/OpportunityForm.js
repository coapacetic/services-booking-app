import React, { useState, useEffect } from 'react';

const OpportunityForm = ({ opportunity, isEditing, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    opportunty_id: '',
    account_id: '',
    opportunity_name: '',
    account_name: '',
    close_date: '',
    delta_average_arr: '',
    services_attached_amount: '',
    stage_number: '',
    forecast_category: '',
    services_next_steps: '',
    ps_manager_name: '',
    owner_name: '',
    opportunity_type: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opportunity && isEditing) {
      setFormData({
        opportunty_id: opportunity.opportunty_id || '',
        account_id: opportunity.account_id || '',
        opportunity_name: opportunity.opportunity_name || '',
        account_name: opportunity.account_name || '',
        close_date: opportunity.close_date || '',
        delta_average_arr: opportunity.delta_average_arr || '',
        services_attached_amount: opportunity.services_attached_amount || '',
        stage_number: opportunity.stage_number || '',
        forecast_category: opportunity.forecast_category || '',
        services_next_steps: opportunity.services_next_steps || '',
        ps_manager_name: opportunity.ps_manager_name || '',
        owner_name: opportunity.owner_name || '',
        opportunity_type: opportunity.opportunity_type || '',
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
    
    if (!formData.opportunty_id.trim()) {
      newErrors.opportunty_id = 'Opportunity ID is required';
    }
    if (!formData.account_id.trim()) {
      newErrors.account_id = 'Account ID is required';
    }
    if (!formData.opportunity_name.trim()) {
      newErrors.opportunity_name = 'Opportunity name is required';
    }
    if (formData.delta_average_arr && isNaN(formData.delta_average_arr)) {
      newErrors.delta_average_arr = 'Delta ARR must be a valid number';
    }
    if (formData.services_attached_amount && isNaN(formData.services_attached_amount)) {
      newErrors.services_attached_amount = 'Services Amount must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        delta_average_arr: formData.delta_average_arr ? parseFloat(formData.delta_average_arr) : null,
        services_attached_amount: formData.services_attached_amount ? parseFloat(formData.services_attached_amount) : null,
        close_date: formData.close_date || null,
      };
      onSubmit(submissionData);
    }
  };

  const stageNumbers = ['1', '2', '3', '4', '5'];
  const opportunityTypes = ['New Business', 'Existing Business', 'Renewal'];
  const forecastCategories = ['Pipeline', 'Forecast', 'Commit', 'Closed', 'Omitted'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-primary-900">
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
            <h3 className="text-lg font-serif font-medium text-primary-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Opportunity ID *
                </label>
                <input
                  type="text"
                  name="opportunty_id"
                  value={formData.opportunty_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                  disabled={isEditing}
                />
                {errors.opportunty_id && (
                  <p className="mt-1 text-sm text-primary-700">{errors.opportunty_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Account ID *
                </label>
                <input
                  type="text"
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                  disabled={isEditing}
                />
                {errors.account_id && (
                  <p className="mt-1 text-sm text-primary-700">{errors.account_id}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Opportunity Name *
              </label>
              <input
                type="text"
                name="opportunity_name"
                value={formData.opportunity_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
              />
              {errors.opportunity_name && (
                <p className="mt-1 text-sm text-primary-700">{errors.opportunity_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Delta ARR
                </label>
                <input
                  type="number"
                  name="delta_average_arr"
                  value={formData.delta_average_arr}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                />
                {errors.delta_average_arr && (
                  <p className="mt-1 text-sm text-primary-700">{errors.delta_average_arr}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Services Attached Amount
                </label>
                <input
                  type="number"
                  name="services_attached_amount"
                  value={formData.services_attached_amount}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                />
                {errors.services_attached_amount && (
                  <p className="mt-1 text-sm text-primary-700">{errors.services_attached_amount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sales Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-medium text-primary-900">Sales Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Stage Number
                </label>
                <select
                  name="stage_number"
                  value={formData.stage_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                >
                  <option value="">Select Stage</option>
                  {stageNumbers.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Close Date
                </label>
                <input
                  type="date"
                  name="close_date"
                  value={formData.close_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  PS Manager Name
                </label>
                <input
                  type="text"
                  name="ps_manager_name"
                  value={formData.ps_manager_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Opportunity Type
                </label>
                <select
                  name="opportunity_type"
                  value={formData.opportunity_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                >
                  <option value="">Select Type</option>
                  {opportunityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Forecast Category
                </label>
                <select
                  name="forecast_category"
                  value={formData.forecast_category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 placeholder-primary-400"
                >
                  <option value="">Select Category</option>
                  {forecastCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Services Next Steps
              </label>
              <textarea
                name="services_next_steps"
                value={formData.services_next_steps}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border-hairline border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
