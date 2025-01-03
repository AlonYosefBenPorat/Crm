import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { usersService } from '../../services/usersService';

const UserAmount = () => {
  const [userData, setUserData] = useState({ activeUsers: 0, roles: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await usersService.getUsers();
        const activeUsers = users.filter(user => user.isEnabled).length;
        const roles = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        setUserData({ activeUsers, roles });
        renderChart(activeUsers, roles);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (activeUsers, roles) => {
    const options = {
      series: Object.values(roles),
      chart: {
        type: 'donut',
        height: '100%',
        width: '100%',
      },
      labels: Object.keys(roles),
      title: {
        text: `Active Users: ${activeUsers}`,
        align: 'center',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    const chart = new ApexCharts(document.querySelector("#user-amount-chart"), options);
    chart.render();
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 h-full">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">User Amount</h5>
        </div>
      </div>
      <div id="user-amount-chart" className="w-full h-full"></div>
    </div>
  );
};

export default UserAmount;