import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';


const LayoutWithSidebar = ({ children,isLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isLoggedIn={isLoggedIn} />
      
      {/* Main Content */}
      <main 
        className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} p-4`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
