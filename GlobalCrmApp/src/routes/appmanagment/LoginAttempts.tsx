import React, { useState, useEffect } from 'react';
import { loginAttemptsService } from '../../services/loginAttemptsService';
import ReactApexChart from 'react-apexcharts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../css/table.scss';
import '../../css/charts.scss';
import { groupBy, mapValues } from 'lodash';
import Spinner from '../../components/Spinner';

const LoginAttempts: React.FC = () => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLoginAttempts = async () => {
      try {
        const data = await loginAttemptsService.getLoginAttempts();
        setLoginAttempts(data);
        setStartDate(new Date(data[0].attemptedAt));
        setEndDate(new Date(data[0].attemptedAt));
      } catch (err) {
        setError('An error occurred while fetching login attempts.');
        console.error('Error fetching login attempts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginAttempts();
  }, []);

  useEffect(() => {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    setEndDate(end);
  }, [startDate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  const filteredLoginAttempts = loginAttempts.filter((attempt: any) => {
    const attemptedAt = new Date(attempt.attemptedAt);
    return attemptedAt >= startDate && attemptedAt <= endDate;
  });

  const successCount = filteredLoginAttempts.filter((attempt: any) => attempt.isSucceeded).length;
  const failureCount = filteredLoginAttempts.length - successCount;
  const groupedSuccessAttempts = mapValues(
    groupBy(filteredLoginAttempts.filter((attempt: any) => attempt.isSucceeded), (attempt: any) => {
      const date = new Date(attempt.attemptedAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}`;
    }),
    (attempts) => attempts.length
  );

  const groupedFailureAttempts = mapValues(
    groupBy(filteredLoginAttempts.filter((attempt: any) => !attempt.isSucceeded), (attempt: any) => {
      const date = new Date(attempt.attemptedAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}`;
    }),
    (attempts) => attempts.length
  );

  const categories = Object.keys({ ...groupedSuccessAttempts, ...groupedFailureAttempts }).sort();
  const successData = categories.map((category) => groupedSuccessAttempts[category] || 0);
  const failureData = categories.map((category) => groupedFailureAttempts[category] || 0);

  const lineOptions = {
    chart: {
      height: '100%',
      type: 'line' as const,
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
      curve: 'smooth' as const,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    series: [
      {
        name: 'Success',
        data: successData,
        color: '#66FF00', 
      },
      {
        name: 'Failure',
        data: failureData,
        color: '#8B0000', 
      },
    ],
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
        },
        format: 'HH:mm',
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Number of Attempts',
      },
    },
  };

  const getChartOptions = () => {
    return {
      series: [successCount, failureCount],
      colors: ["#003262", "#16BDCA", "#9061F9"],
      chart: {
        height: 420,
        width: "100%",
        type: "pie" as const, // Ensure type is one of the allowed string literals
      },
      stroke: {
        colors: ["white"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25
          }
        },
      },
      labels: ["Success", "Failure"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "%"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "%"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  return (
    <div className="login-attempts">
      <h2 className="title">Login Attempts</h2>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Login Attempts Traffic</h3>
              <div className="chart-container">
                <ReactApexChart options={lineOptions} series={lineOptions.series} type="line" height={300} />
              </div>
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Login Attempts Summary</h3>
              <div className="chart-container">
                <ReactApexChart options={getChartOptions()} series={getChartOptions().series} type="pie" height={300} />
              </div>
            </div>
          </div>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek} className="icon-button">
              <FaArrowLeft />
            </button>
            <button onClick={handleNextWeek} className="icon-button">
              <FaArrowRight />
            </button>
          </div>
          <div className="table-container">
            <table className="users-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Attempted At</th>
                  <th>Success</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoginAttempts.map((attempt: any, index: number) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td>{index + 1}</td>
                    <td>{attempt.userName}</td>
                    <td>{formatDate(attempt.attemptedAt)}</td>
                    <td className="status-icon">{attempt.isSucceeded ? '✔️' : '❌'}</td>
                    <td>{attempt.remoteIpAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginAttempts;