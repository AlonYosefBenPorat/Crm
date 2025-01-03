import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '../../services/customerSerivce';
import '../../css/myCustomer.scss';
import { NavLink } from 'react-router-dom';
import ClientToolBar from '../../components/ClientToolbar';

const MyCustomer: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardCustomerName, setSelectedCardCustomerName] = useState('');
  const [selectedCardCustomerId, setSelectedCardCustomerId] = useState('');
  const [selectedCardCustomerLogoSrc, setSelectedCardCustomerLogoSrc] = useState('');
  const [selectedCardCustomerLogoAlt, setSelectedCardCustomerLogoAlt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllCustomers().then(data => {
      setCustomers(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.isActive && customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOnClickCard = (customer) => {
    localStorage.setItem('selectedCardCustomerId', customer.id);
    localStorage.setItem('selectedCardCustomerName', customer.name);
    localStorage.setItem('selectedCardCustomerLogoSrc', customer.logoSrc); 
    localStorage.setItem('selectedCardCustomerLogoAlt', customer.logoAlt); 
    setSelectedCardCustomerId(customer.id);
    setSelectedCardCustomerName(customer.name);
    setSelectedCardCustomerLogoSrc(customer.logoSrc); 
    setSelectedCardCustomerLogoAlt(customer.logoAlt); 
  };

  return (
    <div className="my-customer-container">
      <form className="my-customer-form">
        <label htmlFor="default-search" className="sr-only">Search</label>
        <div className="my-customer-relative">
          <div className="my-customer-icon">
          
          </div>
          <input
            type="search"
            id="default-search"
            className="my-customer-input dark"
            placeholder="Search Customers"
            value={searchTerm}
            onChange={handleSearch}
            required
          />
        </div>
      </form>

      <div className="my-customer-grid">
        {filteredCustomers.map((customer, index) => (
          <NavLink
            key={index}
            to="/clienttoolbar"
            onClick={() => handleOnClickCard(customer)}
            className="my-customer-card-link"
          >
            <div className="my-customer-card dark">
              <img className="my-customer-image" src={customer.logoSrc} alt={customer.logoAlt} />
              <div className="my-customer-content">
                <h5 className="my-customer-title dark">{customer.name}</h5>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      {selectedCardCustomerId && (
        <ClientToolBar
          customerId={selectedCardCustomerId}
          customerName={selectedCardCustomerName}
          customerLogoSrc={selectedCardCustomerLogoSrc}
          customerLogoAlt={selectedCardCustomerLogoAlt}
          // refreshTable={refreshTable}
        />
      )}

      
    </div>
  );
};

export default MyCustomer;