import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import AddUser from './routes/AddUser';
import NotFound from './routes/NotFound';
import LoginModal from './components/LoginModal';
import LayoutWithSidebar from './components/LayoutWithSidebar';
import Roles from './routes/documentation/Roles';
import Users from './routes/appmanagment/Users';
import Customer from './routes/appmanagment/Customer';
import LoginAttempts from './routes/appmanagment/LoginAttempts';
import CustomerPermissionUser from './routes/appmanagment/CustomerPermissionUser';
import MyCustomer from './routes/customerStorge/MyCustomer';
import TicketCrm from './routes/crm/TicketCrm';
import SystemInfo from './routes/documentation/SystemInfo';
import { TicketProvider } from './contexts/TicketContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthContext } from './contexts/AuthContext';
import NoPermission from './routes/Nopermission';
import LandingPage from './routes/LandingPage';
import Home from './routes/Home';
import ResetPasswordModal from './routes/ResetPasswordModal';
import ProtectedRoute from './components/ProtectedRoute';
import ClientToolBar from './components/ClientToolbar';
import EditProfile from './routes/EditProfile';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const { isLoggedIn, login } = useContext(AuthContext);

  const [customerId, setCustomerId] = useState("123");
  const [customerName, setCustomerName] = useState("Example Customer");
  const [customerLogoSrc, setCustomerLogoSrc] = useState("path/to/logo.png");
  const [customerLogoAlt, setCustomerLogoAlt] = useState("Customer Logo");

  const openResetPasswordModal = () => setIsResetPasswordModalOpen(true);
  const closeResetPasswordModal = () => setIsResetPasswordModalOpen(false);
  const handleCloseAddUser = () => {};
  const onClose = () => {};
  const refreshTable = async (): Promise<void> => {
    return new Promise((resolve) => {});
  };

  useEffect(() => {
    console.log("isLoggedIn state in App:", isLoggedIn);
  }, [isLoggedIn]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = async (token: string) => {
    await login(token);
    closeModal();
  };

  return (
    <ErrorBoundary>
      <NavBar openModal={openModal} openResetPasswordModal={openResetPasswordModal} />
      {isLoggedIn ? (
        <LayoutWithSidebar isLoggedIn={isLoggedIn}>
          <Routes>
            {/* CRM Public Routes */}
            <Route path='landing-page' element={<LandingPage />} />
            <Route path="/SystemInfo" element={<SystemInfo />} />

            {/* CRM Protected Routes  All Users With Role assigned */}
            <Route element={<ProtectedRoute allowedRoles={['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin', 'Viewer']} />}>
              <Route path="/ticketCrm" element={
                <TicketProvider>
                  <TicketCrm />
                </TicketProvider>
              } />
              <Route path="/home" element={<Home />} />
              <Route path='/edit-profile' element={<EditProfile />} />
              <Route path='resetPassword' element={<ResetPasswordModal isOpen={isResetPasswordModalOpen} closeModal={closeResetPasswordModal} />} />
              <Route path='clienttoolbar' element={
                <ClientToolBar
                  customerId={customerId}
                  customerName={customerName}
                  customerLogoSrc={customerLogoSrc}
                  customerLogoAlt={customerLogoAlt}
                />
              } />
              <Route path='My-Customers' element={<MyCustomer />} />
            </Route>

            {/* App Management Routes */}
            <Route element={<ProtectedRoute allowedRoles={['GlobalAdmin']} />}>
              <Route path="users" element={<Users />} />
              <Route path="Customer-Directory" element={<Customer />} />
              <Route path="permissions" element={<CustomerPermissionUser onClose={onClose} />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="add-user" element={
                <AddUser
                  onClose={handleCloseAddUser}
                  refreshTable={refreshTable}
                />
              } />
              <Route path='Login-Attempts' element={<LoginAttempts />} />
              
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="no-permission" element={<NoPermission />} />
          </Routes>
        </LayoutWithSidebar>
      ) : (
        <Routes>
          <Route path="login" element={<LoginModal isModalOpen={isModalOpen} closeModal={closeModal} onLogin={handleLogin} />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      )}
      <LoginModal isModalOpen={isModalOpen} closeModal={closeModal} />
      <ResetPasswordModal isOpen={isResetPasswordModalOpen} closeModal={closeResetPasswordModal} />
    </ErrorBoundary>
  );
}

export default App;