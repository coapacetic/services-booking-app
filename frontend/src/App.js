import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import OpportunityTable from './components/OpportunityTable';
import OpportunityForm from './components/OpportunityForm';
import OpportunityDetail from './components/OpportunityDetail';
import { createOpportunity, updateOpportunity } from './services/api';
import { 
  ChartBarIcon, 
  TableCellsIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setCurrentView('detail');
  };

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditing(true);
    setCurrentView('form');
  };

  const handleCreateOpportunity = () => {
    setSelectedOpportunity(null);
    setIsEditing(false);
    setCurrentView('form');
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && selectedOpportunity) {
        await updateOpportunity(selectedOpportunity.salesforce_id, formData);
      } else {
        await createOpportunity(formData);
      }
      setCurrentView('table');
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert('Failed to save opportunity');
    }
  };

  const renderNavigation = () => (
    <nav className="bg-white border-b border-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-serif font-bold text-primary-900">Opportunity Manager</h1>
            </div>
            <div className="ml-6 flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-primary-600 hover:text-primary-700 hover:border-primary-300'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('table')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'table'
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-primary-600 hover:text-primary-700 hover:border-primary-300'
                }`}
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Opportunities
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleCreateOpportunity}
              className="btn btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Opportunity
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'table':
        return (
          <OpportunityTable
            onEdit={handleEditOpportunity}
            onView={handleViewOpportunity}
          />
        );
      case 'form':
        return (
          <OpportunityForm
            opportunity={selectedOpportunity}
            isEditing={isEditing}
            onSubmit={handleFormSubmit}
            onCancel={() => setCurrentView('table')}
          />
        );
      case 'detail':
        return (
          <OpportunityDetail
            opportunity={selectedOpportunity}
            onEdit={handleEditOpportunity}
            onClose={() => setCurrentView('table')}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
