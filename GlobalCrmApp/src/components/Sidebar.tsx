import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaUserShield, FaCog } from 'react-icons/fa';
import { CiMenuBurger } from 'react-icons/ci';
import { BsBuilding, BsBuildingFillGear } from 'react-icons/bs';
import { GrShieldSecurity } from 'react-icons/gr';
import { MdHistory } from 'react-icons/md';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { AuthContext } from '../contexts/AuthContext';
import { RiAppsLine } from 'react-icons/ri';
import { FaUsersRectangle } from 'react-icons/fa6';
import '../css/sidebar.scss';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isLoggedIn }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { role } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const menuItems = [
    { name: 'TicketCrm', icon: <RiAppsLine title='TicketCrm' aria-label='TicketCrm' />, roles: ['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin', 'Viewer'] },
    { name: 'Users', icon: <FaUsers title='Users' aria-label='Users' />, roles: ['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin'] },
    { name: 'Customer-Directory', icon: <FaUsersRectangle title='Customer Directory' aria-label='Customer Directory' />, roles: ['GlobalAdmin', 'ServiceAdmin'] },
    { name: 'My-Customers', icon: <BsBuilding title='My-Customers' aria-label='My-Customers' />, roles: ['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin', 'Viewer'] },
    { name: 'Roles', icon: <FaUserShield title='Roles' aria-label='Roles' />, roles: ['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin'] },
    { name: 'Permissions', icon: <GrShieldSecurity title='Permissions' aria-label='Permissions' />, roles: ['GlobalAdmin', 'RedearAdmin', 'ServiceAdmin'] },
    { name: 'Login-Attempts', icon: <MdHistory title='Login Attempts' aria-label='Login Attempts' />, roles: ['GlobalAdmin', 'RedearAdmin'] },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`sidebar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <button
        className="menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <CiMenuBurger className='icon-button' />
      </button>
      <div className={`sidebar-content ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="p-6"></div>
        <div className="p-6"></div>
        <ul className="mt-4 border-t border-divider">
          {menuItems
            .filter(item => item.roles.includes(role))
            .map((item, index) => (
              <li key={index} className={`menu-item ${item.name === 'TicketCrm' ? 'mobile-visible' : 'mobile-hidden'}`}>
                <NavLink
                  to={`/${item.name.toLowerCase().replace(/ /g, '-')}`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="icon-button">{item.icon}</span>
                  <span className="text">{item.name}</span>
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;