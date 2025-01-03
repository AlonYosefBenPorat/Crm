import React, { useState, useEffect } from 'react';
import '../../css/subActivityTabs.scss';
import TicketActivity from './TicketActivity';
import CustomerHistory from './CustomerHistory';
import CustomerEmpolyee from './CustomerEmpolyee';

interface SubActivityTabsProps {
  ticket: any;
  activities: any[];
  refreshData: (ticketId: string) => Promise<void>;
  refreshActivity: () => Promise<void>;
}

const History: React.FC = () => (
  <div>
    <h3 className="tab-title">History Tab</h3>
    <p className="tab-content">Content for the History tab.</p>
  </div>
);

const CustomerEmployee: React.FC = () => (
  <div>
    <h3 className="tab-title">Customer Items Tab</h3>
    <p className="tab-content">Content for the Customer Items tab.</p>
  </div>
);


const SubActivityTabs: React.FC<SubActivityTabsProps> = ({ ticket, activities, refreshData, refreshActivity }) => {
  const [activeTab, setActiveTab] = useState('Submission');

  useEffect(() => {
   
  }, [ticket]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Submission':
        return (
          <TicketActivity
        
          />
        );
      case 'History':
        return <CustomerHistory customerId={ticket.customerId}/>;
      case 'Customer Employee':
        return <CustomerEmpolyee customerId={ticket.customerId}/>;
      default:
        return null;
    }
  };

  return (
    <div className="sub-activity-tabs">
      <ul className="tabs">
        {['Submission', 'History', 'Customer Employee'].map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content-container">{renderContent()}</div>
    </div>
  );
};

export default SubActivityTabs;