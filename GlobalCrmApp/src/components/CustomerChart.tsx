import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getAllEmployees } from '../services/EmployeeService';
import { getServerData } from '../services/ServerService';
import { getNetworkDeviceData } from '../services/networkDeviceService';
import { getFirewallData } from '../services/firewallService';
import { getBackupData } from '../services/backupService';
import { formatDate } from '../helperFunction/formatDate';
import '../css/CustomerChart.scss';

const CustomerChart = () => {
  const [data, setData] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [expiringSoonItems, setExpiringSoonItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const selectedCustomerId = localStorage.getItem('selectedCardCustomerId');
      if (!selectedCustomerId) {
        console.error('No selected customer ID found in local storage');
        return;
      }

      try {
        const employeeData = await getAllEmployees(selectedCustomerId);
        const serverData = await getServerData(selectedCustomerId);
        const networkDeviceData = await getNetworkDeviceData(selectedCustomerId);
        const gatewayData = await getFirewallData(selectedCustomerId);
        const backupData = await getBackupData(selectedCustomerId);

        // Calculate the number of employees and servers
        const employeeCount = employeeData.length;
        const serverCount = serverData.length;
        const networkDeviceCount = networkDeviceData.length;
        const gatewayCount = gatewayData.length;
        const backupCount = backupData.length;

        const chartData = [
          { name: 'Employee', amount: employeeCount },
          { name: 'Server', amount: serverCount },
          { name: 'Network Device', amount: networkDeviceCount },
          { name: 'Gateway', amount: gatewayCount },
          { name: 'BackupPlan', amount: backupCount },
        ];

        setData(chartData);

        // Filter warranties and licenses
        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        const expired = [
          ...serverData.filter(server => new Date(server.warrantyExpiration) < now),
          ...networkDeviceData.filter(device => new Date(device.warrantyExpiration) < now),
          ...gatewayData.filter(gateway => new Date(gateway.license) < now),
        ];

        const expiringSoon = [
          ...serverData.filter(server => new Date(server.warrantyExpiration) >= now && new Date(server.warrantyExpiration) <= oneMonthFromNow),
          ...networkDeviceData.filter(device => new Date(device.warrantyExpiration) >= now && new Date(device.warrantyExpiration) <= oneMonthFromNow),
          ...gatewayData.filter(gateway => new Date(gateway.license) >= now && new Date(gateway.license) <= oneMonthFromNow),
        ];

        setExpiredItems(expired);
        setExpiringSoonItems(expiringSoon);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: 'Count',
      data: data.map(item => item.amount),
    },
  ];

  const chartOptions = {
    chart: {
      type: 'bar' as const,
      height: 240,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: '',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 2,
        distributed: true, // This ensures each bar has a different color
      },
    },
    xaxis: {
      categories: data.map(item => item.name),
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#dddddd',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  return (
    <div className="customer-chart-container">
      <div className="chart-header">
        <h6 className="chart-title">Line Chart of Customers Inventory</h6>
      </div>
      <div className="chart-content">
        <ReactApexChart options={chartOptions} series={series} type="bar" height={240} />
      </div>
      <div className="warranty-boxes">
        {expiredItems.length > 0 && (
          <div className="warranty-box expired">
            <h3>Expired Items</h3>
            <ul>
              {expiredItems.map(item => (
                <li key={item.id}>{item.model} - {formatDate(item.warrantyExpiration || item.license)}</li>
              ))}
            </ul>
          </div>
        )}
        {expiringSoonItems.length > 0 && (
          <div className="warranty-box expiring-soon">
            <h3>Items Expiring Soon</h3>
            <ul>
              {expiringSoonItems.map(item => (
                <li key={item.id}>{item.model} - {formatDate(item.warrantyExpiration || item.license)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerChart;